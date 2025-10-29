import React, { Component, ReactNode } from 'react';
import { DEFAULT_BASEMAP_CONFIG, geomapLayerRegistry, defaultBaseLayer } from './layers/registry';
import { Map, MapBrowserEvent, View } from 'ol';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import ScaleLine from 'ol/control/ScaleLine';
import BaseLayer from 'ol/layer/Base';
import { defaults as interactionDefaults } from 'ol/interaction';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import { createEmpty, extend } from 'ol/extent';
import VectorLayer from 'ol/layer/Vector';
import { Vector } from 'ol/source';
// import LayerSwitcher from 'ol-layerswitcher';
import { isArray, isEqual } from 'lodash';
import './GeomapPanel.css';
import "bootstrap-icons/font/bootstrap-icons.css";

// Load directly when plugin
import 'static/css/fontmaki2.css';
import 'static/css/fontmaki.css';

// import 'ol-layerswitcher/dist/ol-layerswitcher.css';

// import WKT from 'ol/format/WKT.js';
// import Polygon from 'ol/geom/Polygon.js';
// import { /*locationService,*/ getTemplateSrv } from '@grafana/runtime';

import {
  PanelData,
  MapLayerHandler,
  PanelProps,
  // GrafanaTheme,
  DataHoverClearEvent,
  DataHoverEvent,
  DataFrame,
  DataSelectEvent,
  // getFieldDisplayName,
  getFieldDisplayValuesProxy,
  ScopedVars,
  BusEventWithPayload,
  // getFieldDisplayValues,
  // GrafanaTheme2
} from '@grafana/data';
import { /*getTemplateSrv,*/ config,/*, RefreshEvent, TimeRangeUpdatedEvent*/ 
/*RefreshEvent,*/ locationService} from '@grafana/runtime';

import { ControlsOptions, GeomapPanelOptions, MapViewConfig } from './types';
import { centerPointRegistry, MapCenterID } from './view';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import { css } from '@emotion/css';
import { PanelContext, PanelContextRoot, Portal ,/* stylesFactory, useStyles2, */ VizTooltipContainer } from '@grafana/ui';
import { GeomapOverlay, OverlayProps } from './GeomapOverlay';
import { DebugOverlay } from './components/DebugOverlay';
import { getGlobalStyles } from './globalStyles';
import { GeomapHoverFeature, GeomapHoverPayload } from './event';
import { DataHoverView } from './components/DataHoverView';
import { ExtendMapLayerOptions } from './extension';
import SpatialFilterControl from './mapcontrols/SpatialFilter';
import { testIds } from 'e2eTestIds';
import { Global } from '@emotion/react';
import { Subscription } from 'rxjs';
import { DataExtentZoom } from 'mapcontrols/DataExtentZoom';
import { CustomLayerSwitcher } from 'mapcontrols/CustomLayerSwitcher';
import { CustomOverviewMapWrapper } from 'mapcontrols/CustomOverviewMapWrapper';
import Group from 'ol/layer/Group';
import { GroupLayerOptions } from 'ol-layerswitcher';
// import { BasemapLegend } from 'mapcontrols/BasemapLegend';
// import { VariablesChangedEvent } from 
// import {getBottomLeft, getBottomRight, getTopLeft, getTopRight} from 'ol/extent';

interface MapLayerState {
  config: ExtendMapLayerOptions;
  handler: MapLayerHandler;
  layer: BaseLayer; // used to add|remove
}

// Allows multiple panels to share the same view instance
let sharedView: View | undefined = undefined;
export let lastGeomapPanelInstance: GeomapPanel | undefined = undefined;

type Props = PanelProps<GeomapPanelOptions>;
interface State extends OverlayProps {
  ttip?: GeomapHoverPayload;
  ttipOpen: boolean;
}

// Initialize index variable for data sources
// const CONSTANT_SPATIAL_FILTER_VARIABLE_NAME = "geomap_wms_spatial_filter_geometry";
// (getTemplateSrv() as any).index[SPATIAL_FILTER_VARIABLE_NAME] = {
//             current: {
//                 value: new WKT().writeGeometry(
//                   new Polygon([
//                     [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]
//                   ]), 
//                   {
//                     dataProjection: 'EPSG:4326',
//                     featureProjection: 'EPSG:4326' // Default projection https://openlayers.org/doc/faq.html#what-projection-is-openlayers-using- (see initalization in  initMapView-function)
//                   }
//                   )
//             }
//             };

// As stated here: https://grafana.com/developers/plugin-tools/create-a-plugin/develop-a-plugin/subscribe-events#what-events-are-supported
class MyPanelEditExitedEvent extends BusEventWithPayload<number> {
  static type = 'panel-edit-finished';
}

export class GeomapPanel extends Component<Props, State> {
  globalCSS = getGlobalStyles(config.theme2);

  declare context: React.ContextType<typeof PanelContextRoot>;
  static contextType = PanelContextRoot;
  panelContext: PanelContext | undefined = undefined;

  counter = 0;
  map?: Map;
  basemap?: BaseLayer;
  layers: MapLayerState[] = [];
  mouseWheelZoom?: MouseWheelZoom;
  // style = getStyles(config.theme2);
  hoverPayload: GeomapHoverPayload = { point: {}, pageX: -1, pageY: -1 };
  readonly hoverEvent = new DataHoverEvent(this.hoverPayload);
  private subs = new Subscription();
  mapDiv?: HTMLDivElement;

  constructor(props: Props/*, state: State*/) {
    super(props);
    // this.state = {};
    this.state = { ttipOpen: false };

    this.subs.add(
      this.props.eventBus.getStream(MyPanelEditExitedEvent).subscribe((evt) => {
        if (this.mapDiv && this.props.id === evt.payload) {
            this.initMapRef(this.mapDiv);
          }
        })
    );

    // this.props.eventBus.getStream(DataSelectEvent).subscribe((event) => {

    // });

    // Data links (click on feature and set variable. Works e.g. with name)
    // E.g.: http://localhost:8002/d/dfe46662-eff7-43b7-8cce-dcea307d3b7d/20240227-qet-poc-copy?orgId=1&var-qet_name=${__data.fields["NAME"]}
    // http://localhost:8002/d/c45df172-d369-455e-ae1c-994e196d4fd0/dz-m-demonstrator-treesense-copy?var-tree_sensor=${__data.fields.Sensor}
    // Reference: https://grafana.com/docs/grafana/latest/panels-visualizations/configure-data-links/#data-variables
    this.subs.add(
      this.props.eventBus.getStream(DataSelectEvent).subscribe((event) => {
        if (event.payload.data === undefined) {
          return;
        }

        let dataFrame: DataFrame = event.payload.data!;
        let rowIndex: number = event.payload.rowIndex!;

        // Return if either dataframe or rowIndex are undefined
        if (dataFrame === undefined || rowIndex === undefined) {
          return;
        }

        // Get options for data layer with refIf of dataframes and check if the data layer is configured for datalinks
        const dataLayer = this.props.options.layers.find((el) => {
          try {
            return el.query!.options === dataFrame.refId;
          } catch (error) {
            return false;
          }
        })

        if (!dataLayer) {
          return;
        }

        // By default 'enabledForDataLinks' is considered to be true, even though it might not be defined.
        // I.e. the value must be explicitely set to false to be excluded
        if (dataLayer.enabledForDataLinks !== undefined && dataLayer.enabledForDataLinks === false) {
          return;
        }

        // let proxyObject = getFieldDisplayValuesProxy({
        //   frame: this.state.ttip!.data!,
        //   rowIndex: this.state.ttip!.rowIndex!
        // });
        let proxyObject = getFieldDisplayValuesProxy({ // https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/field/getFieldDisplayValuesProxy.ts
          frame: dataFrame,
          rowIndex: rowIndex
        });
        // console.log(proxyObject);

        const scopedVars: ScopedVars = { ...{} }; // https://github.com/grafana/grafana/blob/61934588c579005de80c54b15f42f0d9449efd93/public/app/features/explore/utils/links.ts#L131
        scopedVars['__data'] = {
          value: {
            name: dataFrame.name,
            refId: dataFrame.refId,
            fields: proxyObject,
          },
          text: 'Data',
        };

        let urlString: string | undefined = undefined;
        try {
          // console.warn("Currently only one link (the 1st one) is processed.");

          // Interpolate url
          urlString = this.props.replaceVariables(this.props.fieldConfig.defaults.links![0].url, // dataFrame.fields[0].config.links![0].url
            scopedVars);
          // console.log(urlString);
        } catch (error) {
          // console.log("Might have no links defined.");
          // console.error(error);
          return;
        }

        try {
          let url: any = {};

          try {
            url = new URL(urlString);
          } catch (error) {
            url = new URL(urlString, location.origin);
          }

          let updateVars: Record<string, string>  = {};

          for (const [key, value] of url.searchParams) {
            updateVars[key] = value;
          }

          const localhostAliases = [
            "localhost",
            "127.0.0.1"
          ]

          if ((location.origin === url.origin || 
            (localhostAliases.includes(url.hostname) && localhostAliases.includes(location.hostname) && url.port === location.port)) &&
            (this.props.fieldConfig.defaults.links![0].targetBlank === undefined || 
              this.props.fieldConfig.defaults.links![0].targetBlank === false)) {
            if(location.pathname === url.pathname) {
              // Update url with query parameters
              locationService.partial({ ...updateVars }, true);
            } else {
              locationService.push(url.pathname + url.search);
            }
          } else {
            if (this.props.fieldConfig.defaults.links![0].targetBlank === undefined || 
              this.props.fieldConfig.defaults.links![0].targetBlank === false) {
              // location.assign(url);
              location.assign(url);
            } else {
              open(url, "_blank");
            }
            
          }
          
        } catch (error) {
          // console.error(error);
          return;
        }
      })
    );
  }

  componentDidMount() {
    lastGeomapPanelInstance = this;
    // this.initMapRef(this.mapDiv!);

    // https://github.com/grafana/grafana/blob/633486e4f13c91940d9681d4768807776ecdcd7f/public/app/plugins/panel/geomap/GeomapPanel.tsx#L77C5-L77C38
    this.panelContext = this.context;
  }

  // https://github.com/grafana/grafana/blob/aac6e6dfd94c78b250e796dbff9422d202cb54e8/public/app/plugins/panel/geomap/GeomapPanel.tsx#L112C3-L120
  componentDidUpdate(prevProps: Props) {
    if (this.map && (this.props.height !== prevProps.height || this.props.width !== prevProps.width)) {
      this.map.updateSize();
    }
    // Check for a difference between previous data and component data
    if (this.map && this.props.data !== prevProps.data) {
      this.dataChanged(this.props.data);
    }
  }

  // https://github.com/grafana/grafana/blob/dfae694cff68b022a4614e1c967aebe7d059d4b7/public/app/plugins/panel/geomap/GeomapPanel.tsx#L80-L87
  componentWillUnmount() {
    this.subs.unsubscribe();
    for (const lyr of this.layers) {
      lyr.handler.dispose?.();
    }
    // Ensure map is disposed
    this.map?.dispose();
  }

  shouldComponentUpdate(nextProps: Props) {
    if (!this.map) {
      return true; // not yet initalized
    }

    // Check for resize
    if (this.props.height !== nextProps.height || this.props.width !== nextProps.width) {
      this.map.updateSize();
    }

    // External configuration changed
    let layersChanged = false;
    if (this.props.options !== nextProps.options) {
      layersChanged = this.optionsChanged(nextProps.options);
    }

    // External data changed
    if (layersChanged || this.props.data !== nextProps.data) {
      this.dataChanged(nextProps.data);
    }

    return true; // always?
  }

  /**
   * Called when the panel options change
   */
  optionsChanged(options: GeomapPanelOptions): boolean {
    let layersChanged = false;
    const oldOptions = this.props.options;

    if (options.view !== oldOptions.view) {
      this.map!.setView(this.initMapView(options.view));
    }

    if (options.controls !== oldOptions.controls) {
      this.initControls(options.controls ?? { showZoom: true, showAttribution: true, showLayercontrol: true });
    }

    if (options.basemap !== oldOptions.basemap) {
      this.initBasemap(options.basemap);
      layersChanged = true;
    }

    if (options.layers !== oldOptions.layers) {
      this.initLayers(options.layers ?? []); // async
      layersChanged = true;
    }
    return layersChanged;
  }

  /**
   * Called when PanelData changes (query results etc)
   */
  dataChanged(data: PanelData) {
    for (const state of this.layers) {
      if (state.handler.update) {
        state.handler.update(data);
      }
    }
    if (this.props.options.view.id === MapCenterID.Auto && this.map) {
      let extent = createEmpty();
      // If layer is group layer extract the layers => see markersLayer.tsx line 324 where the markers layer is returned as Group
      // const layers = this.map.getLayers().getArray();
      const layers = this.map.getAllLayers();
      for (let layer of layers) {
        if (layer instanceof VectorLayer) {
          let source = layer.getSource();
          if (source !== undefined && source instanceof Vector) {
            let features = source.getFeatures();
            for (let feature of features) {
              let geo = feature.getGeometry();
              if (geo) {
                extend(extent, geo.getExtent());
              }
            }
          }
        }
      }
      if (!isEqual(extent, createEmpty())) {
        this.map.getView().fit(extent);
        let zoom = this.map.getView().getZoom();
        if (zoom) {
          this.map.getView().setZoom(zoom - 0.5);
        }
      }
    }
  }

  initMapRef = async (div: HTMLDivElement) => {
    if (!div) {
      this.map = undefined as unknown as Map;
      return;
    }

    this.mapDiv = div;
    if (this.map) {
      this.map.dispose();
    }

    // Load fontmaki fonts which are used for icons
    for (const fontFace of document.fonts) {
      // if (fontFace.family.toLowerCase().includes("fontmaki") || 
      //         fontFace.family.toLowerCase().includes("grafana")) {
        await fontFace.load()
      // }
    }
    // await document.fonts.ready

    const { options } = this.props;
    this.map = new Map({
      view: this.initMapView(options.view),
      pixelRatio: 1, // or zoom?
      layers: [], // loaded explicitly below
      controls: [],
      target: this.mapDiv,
      interactions: interactionDefaults({
        mouseWheelZoom: false, // managed by initControls
      }),
    });
    this.mouseWheelZoom = new MouseWheelZoom();
    this.map.addInteraction(this.mouseWheelZoom);
    await this.initControls(options.controls);
    await this.initBasemap(options.basemap);
    await this.initLayers(options.layers);
    this.forceUpdate(); // first render

    // Tooltip listener
    this.map.on('pointermove', this.pointerMoveListener);

    this.map.on('singleclick', this.singleClickListener); // https://openlayers.org/en/latest/apidoc/module-ol_MapBrowserEvent-MapBrowserEvent.html

    this.map.getViewport().addEventListener('mouseout', (evt) => {
      this.props.eventBus.publish(new DataHoverClearEvent());
    });

  };

  singleClickListener = (evt: MapBrowserEvent<UIEvent>) => {
    // console.log("Fired single click event");
    evt.preventDefault();
    evt.stopPropagation();
    
    if (!this.map) {
      return;
    }

    // If there are no data links do nothing
    if (this.props.fieldConfig.defaults.links === undefined || 
      this.props.fieldConfig!.defaults!.links!.length === 0) {
      return;      
    }

    // For now only take the first entry of the data links
    // TODO: extract the first variable where there should be interpolated and set dashboard variable and display field name
    // this.currentDashboardVariable =
    // this.currentFieldName =

    // Call pointerMoveListener to process event since data select event is based on datahover event
    this.pointerMoveListener(evt);

    // Push data select event
    this.props.eventBus.publish({ ...this.hoverEvent, type: "data-select" });
  }


  pointerMoveListener = (evt: MapBrowserEvent<UIEvent>) => {
    if (!this.map) {
      return;
    }
    const mouse = evt.originalEvent as any;
    const pixel = this.map.getEventPixel(mouse);
    const hover = toLonLat(this.map.getCoordinateFromPixel(pixel));

    const { hoverPayload } = this;
    hoverPayload.pageX = mouse.pageX;
    hoverPayload.pageY = mouse.pageY;
    hoverPayload.point = {
      lat: hover[1],
      lon: hover[0],
    };
    hoverPayload.data = undefined;
    hoverPayload.rowIndex = undefined;
    hoverPayload.propsToShow = undefined;
    let ttip: GeomapHoverPayload = {} as GeomapHoverPayload;
    const features: GeomapHoverFeature[] = [];
    this.map.forEachFeatureAtPixel(pixel, (feature, layer, geo) => {
      let propsToShow = [];
      if (!hoverPayload.data) {
        let props = feature.getProperties();
        if (props['features'] && isArray(props['features']) && props['features'].length === 1) {
          props = props['features'][0].getProperties();
        }
        let frame = props['frame'];
        const thisLayer = layer !== null ? layer.getProperties() : {};
        if (frame) { // if display properties is empty do not show tooltip // thisLayer.displayProperties !== undefined && thisLayer.displayProperties.length > 0 && 
          for (let thisLayerName of typeof thisLayer.displayProperties !== 'undefined'
            ? thisLayer.displayProperties
            : []) {
            let found = frame.fields.filter((obj: { name: string }) => {
              return obj.name === thisLayerName;
            });
            propsToShow.push(found[0]);
          }
          hoverPayload.icon = thisLayer.icon ? thisLayer.icon : '';
          hoverPayload.data = ttip.data = frame as DataFrame;
          hoverPayload.propsToShow = propsToShow.length > 0 ? propsToShow : undefined; // frame.fields;
          hoverPayload.titleField = frame.fields.filter((obj: { name: any }) => {
            return obj.name === thisLayer.titleField;
          });
          hoverPayload.timeField = frame.fields.filter((obj: { name: any }) => {
            return obj.name === thisLayer.timeField;
          });
          hoverPayload.rowIndex = ttip.rowIndex = props['rowIndex'];
        }
      }
      features.push({ feature, layer, geo });
    });
    this.hoverPayload.features = features.length ? features : undefined;

    // this.map.getTargetElement().style.cursor = features.length ? 'pointer' : '';
    this.map.getTargetElement().style.cursor = features.length ? 'pointer' : ''; // && this.hoverPayload.data !== undefined

    this.props.eventBus.publish(this.hoverEvent);

    const currentTTip = this.state.ttip;
    if (ttip.data !== currentTTip?.data || ttip.rowIndex !== currentTTip?.rowIndex) {
      if (hoverPayload.propsToShow !== undefined || hoverPayload.data === undefined) { // only update/show tooltip if data is not undefined (hovering over feature) or data is undefined (not hovering over feature)
        this.setState({ ttip: { ...hoverPayload } });
      } else {
        this.clearTooltip();
      }
    }
  };

  async initBasemap(cfg: ExtendMapLayerOptions) {    
    if (!this.map) {
      return;
    }

    if (!cfg?.type || config.geomapDisableCustomBaseLayer) {
      cfg = DEFAULT_BASEMAP_CONFIG;
    }
    const item = geomapLayerRegistry.getIfExists(cfg.type) ?? defaultBaseLayer;
    const handler = await item.create(this.map, cfg, config.theme2);
    const layer = handler.init();
    if (this.basemap) {
      this.map.removeLayer(this.basemap);
      this.basemap.dispose();
    }
    this.basemap = layer;
    this.map.getLayers().insertAt(0, this.basemap);

    // Set dashboard variable https://community.grafana.com/t/how-to-use-template-variables-in-your-data-source/63250
    // this.setSpatialFilterGeometryVariable();
  }

  async initLayers(layers: ExtendMapLayerOptions[]) {
    // 1st remove existing layers
    for (const state of this.layers) {
      this.map!.removeLayer(state.layer);
      state.layer.dispose();
    }

    if (!layers) {
      layers = [];
    }

    const legends: React.ReactNode[] = [];
    this.layers = [];
    for (const overlay of layers) {
      const item = geomapLayerRegistry.getIfExists(overlay.type);
      if (!item) {
        // console.warn('unknown layer type: ', overlay);
        continue; // TODO -- panel warning?
      }

      const handler = await item.create(this.map!, overlay, config.theme2);
      // If it is a basemap create group with title to make it visible in the legend: https://github.com/walkermatt/ol-layerswitcher/blob/main/examples/layerswitcher.js#L10
      const layer = item.isBaseMap ? new Group({layers: [handler.init()], title: overlay.name, combine: true,} as GroupLayerOptions) : handler.init();
      
      // Set visible to false if toggle is not set to make layer not selected in switch layer control
      if (overlay.visible !== undefined && overlay.visible === false) {
        layer.setVisible(false)
      }

      (layer as any).___handler = handler;
      this.map!.addLayer(layer);
      this.layers.push({
        config: overlay,
        layer,
        handler,
      });

      if (handler.legend) {
        legends.push(<div key={`${this.counter++}`}>{handler.legend}</div>);
      }
    }
    this.setState({ bottomLeft: legends });

    // Update data after init layers
    this.dataChanged(this.props.data);
  }

  initMapView(config: MapViewConfig): View {
    let view = new View({
      center: [0, 0],
      zoom: 1,
      showFullExtent: true, // alows zooming so the full range is visiable
    });

    // With shared views, all panels use the same view instance
    if (config.shared) {
      if (!sharedView) {
        sharedView = view;
      } else {
        view = sharedView;
      }
    }

    const v = centerPointRegistry.getIfExists(config.id);
    if (v) {
      let coord: Coordinate | undefined = undefined;
      if (v.lat == null) {
        if (v.id === MapCenterID.Coordinates || v.id === MapCenterID.Auto) {
          coord = [config.lon ?? 0, config.lat ?? 0];
        } else {
          // console.log('TODO, view requires special handling', v);
        }
      } else {
        coord = [v.lon ?? 0, v.lat ?? 0];
      }
      if (coord) {
        view.setCenter(fromLonLat(coord));
      }
    }

    if (config.maxZoom) {
      view.setMaxZoom(config.maxZoom);
    }
    if (config.minZoom) {
      view.setMaxZoom(config.minZoom);
    }
    if (config.zoom) {
      view.setZoom(config.zoom);
    }
    return view;
  }

  async initControls(options: ControlsOptions) {
    if (!this.map) {
      return;
    }
    this.map.getControls().clear();

    if (options.showZoom) {
      this.map.addControl(new Zoom());
    }

    if (options.showScale) {
      this.map.addControl(
        new ScaleLine({
          units: options.scaleUnits,
          minWidth: 100,
        })
      );
    }

    if (options.showLayercontrol) {
      this.map.addControl(
        // new LayerSwitcher({
        //   label: '',
        //   collapseLabel: '›',
        //   tipLabel: 'Select layers',
        //   groupSelectStyle: 'none',
        //   activationMode: 'click',
        // })
        new CustomLayerSwitcher({
          label: '',
          collapseLabel: '›',
          tipLabel: 'Select layers',
          groupSelectStyle: 'none',
          activationMode: 'click',
          hiddenClassNameButton: "bi bi-layers"
        })
      );
    }

    // Add custom controls
    if (options.showSpatialFilter === true) {
      this.map.addControl(
        new SpatialFilterControl(this.map, this.props)
        );
    }

    if (options.showDataExtentZoom === true) {
      this.map.addControl(
        new DataExtentZoom()
        );
    }

    if (options.overviewMap && options.overviewMap.enabled === true) {
      const item = geomapLayerRegistry.getIfExists(options.overviewMap.type);
      const handler = await item!.create(new Map({}), options.overviewMap as ExtendMapLayerOptions<any>, config.theme2);
      const layer = handler.init();
      this.map.addControl(
        new CustomOverviewMapWrapper({
          layers: [layer]
        }).getOverviewMap()
      );
    }

    const map = this.map;

    let zoomCluster = function (pixel: number[]) {
      let feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });

      if (feature) {
        let features = feature.get('features');
        if (features && features.length > 1) {
          let extent = createEmpty();
          features.forEach(function (f: any) {
            extend(extent, f.getGeometry().getExtent());
          });
          const view = map.getView();
          view.fit(extent);
          const currentZoom = view.getZoom();
          if (currentZoom) {
            map.getView().setZoom(currentZoom - 2);
          }
        }
      }
    };

    this.map.on('click', function (evt: MapBrowserEvent<any>) {
      zoomCluster(evt.pixel);
    });

    this.mouseWheelZoom!.setActive(Boolean(options.mouseWheelZoom));

    if (options.showAttribution) {
      this.map.addControl(new Attribution({
        collapsed: true, 
        collapsible: true ,
        label: '',
        expandClassName: 'bi bi-info-circle',
        // collapseClassName: ''
      }));
    }

    // Update the react overlays
    let topRight: ReactNode[] = [];
    if (options.showDebug) {
      topRight = [<DebugOverlay key="debug" map={this.map} />];
    }

    this.setState({ topRight });
  }

  clearTooltip = () => {
    if (this.state.ttip && !this.state.ttipOpen) {
      this.tooltipPopupClosed();
    }
  };

  tooltipPopupClosed = () => {
    this.setState({ ttipOpen: false, ttip: undefined });
  };

  render() {
    const { ttip, topRight, bottomLeft } = this.state;

    // Tooltip handling from: https://github.com/grafana/grafana/blob/17a3ec52b651a082bbf5604f75975c12cd2ba9ed/public/app/plugins/panel/geomap/GeomapPanel.tsx#L386
    // let { ttip, ttipOpen, topRight1, legends, topRight2 } = this.state;
    // const { options } = this.props;
    // const showScale = options.controls.showScale;
    // if (!ttipOpen && options.tooltip?.mode === TooltipMode.None) {
    //   ttip = undefined;
    // }

    return (
      <>
        {
          <Global styles={this.globalCSS} />
        }
        <div className={styles.wrap} data-testid={testIds.geomapPanel.container} onMouseLeave={this.clearTooltip}>
          <div className={styles.map} ref={this.initMapRef}></div>
          <GeomapOverlay bottomLeft={bottomLeft} topRight={topRight} />
        </div>
          {ttip && ttip.data && (
            <Portal>
              <VizTooltipContainer
                className={styles.viz}
                position={{ x: ttip.pageX, y: ttip.pageY }}
                offset={{ x: 10, y: 10 }}
              >
                <DataHoverView {...ttip} />
              </VizTooltipContainer>
            </Portal>
          )}
        
      </>
    );
  }
}

// const getStyles = stylesFactory((theme: GrafanaTheme2) => ({
//   wrap: css`
//     position: relative;
//     width: 100%;
//     height: 100%;
//   `,
//   map: css`
//     position: absolute;
//     z-index: 0;
//     width: 100%;
//     height: 100%;
//   `,
//   viz: css`
//     border-radius: 10px;
//   `,
// }));

const styles = {
  wrap: css({
    position: "relative",
    width: "100%",
    height: "100%",
  }),
  map: css({
    position: "absolute",
    zIndex: "0",
    width: "100%",
    height: "100%",
  }),
  viz: css({
    borderRadius: "10px",
  }),
};
