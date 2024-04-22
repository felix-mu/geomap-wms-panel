import Control from "ol/control/Control";
import * as olCss from "ol/css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "ol/ol.css";
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import Draw, { DrawEvent } from 'ol/interaction/Draw.js';
// import WKT from 'ol/format/WKT.js';
// import { GeomapPanel } from "GeomapPanel";
// import { RefreshEvent/*, getTemplateSrv , getAppEvents, RefreshEvent, getAppEvents, getDataSourceSrv, createQueryRunner*/} from '@grafana/runtime';
import { Map } from "ol";
import Polygon from "ol/geom/Polygon";
import WKT from 'ol/format/WKT.js';
import { locationService } from '@grafana/runtime';

// Based on https://openlayers.org/en/latest/examples/custom-controls.html
class SpatialFilterControl extends Control {
    static CONSTANT_SPATIAL_FILTER_VARIABLE_NAME = "geomap_wms_spatial_filter_geometry";
    static defaultSpatialFilterGeometry = new WKT().writeGeometry(
      new Polygon([
        // [getBottomLeft(extent), getBottomRight(extent), getTopRight(extent), getTopLeft(extent), getBottomLeft(extent)]
        [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]
      ]), 
      {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326' // Default projection https://openlayers.org/doc/faq.html#what-projection-is-openlayers-using- (see initalization in  initMapView-function)
      }
      );
    
    isActive: boolean;
    drawLayer: VectorLayer<VectorSource>;
    drawSource: VectorSource;
    drawInteraction: Draw;
    props: any;
    currentGeometry: string | undefined;
    icon: Element;

    constructor(map: Map, props: any, opt_options?: any) {
        const options = opt_options || {};
    
        const button = document.createElement('button');
        button.setAttribute("type", "button");
        // button.innerHTML = 'D';
        const icon = document.createElement('i');
        icon.className = "bi bi-funnel";
        button.appendChild(icon);
    
        const element = document.createElement('div');
        element.className = `ol-zoom ol-touch ${olCss.CLASS_UNSELECTABLE} ${olCss.CLASS_CONTROL}`;
        button.setAttribute("aria-label", "spatial filter tool button");
        element.style.top = "50%";
        element.appendChild(button);
    
        super({
          element: element,
          target: options.target,
        });
        
        this.icon = icon;
        this.props = props;
        this.isActive = false; // state of tool (if tool gets deactivated all the layers have to be cleared and the variable has to be set to the map extent)
        this.drawSource = new VectorSource({wrapX: false});
        this.drawLayer = new VectorLayer({
          source: this.drawSource,
        });
        this.currentGeometry = SpatialFilterControl.defaultSpatialFilterGeometry;
        
        map.addLayer(this.drawLayer);
        this.drawInteraction = new Draw({
            source: this.drawSource,
            type: "Polygon",
        });

        this.drawInteraction.on("drawend", (event: DrawEvent) => {
            // this.currentGeometry = event.feature.getGeometry() as Polygon;
            this.currentGeometry = new WKT().writeGeometry(
                  event.feature.getGeometry()!, 
                  {
                    dataProjection: 'EPSG:4326',
                    featureProjection: this.getMap()?.getView().getProjection()
                  }
                  );
            // let wkt = new WKT().writeGeometry(
            //     event.feature.getGeometry()!, 
            //     {
            //       dataProjection: 'EPSG:4326',
            //       featureProjection: this.getMap()?.getView().getProjection()
            //     }
            //     )
            // let tmplSrv = getTemplateSrv();
            // (tmplSrv as any).index[GeomapPanel.spatialFilterVariableName] = {
            //     current: {
            //     value: wkt
            //     }
            // };

            // https://grafana.com/developers/plugin-tools/create-a-plugin/extend-a-plugin/add-support-for-variables#set-a-variable-from-your-plugin
            let filterVariable: Record<string, any> = {};
            filterVariable['var-' + SpatialFilterControl.CONSTANT_SPATIAL_FILTER_VARIABLE_NAME] = this.currentGeometry;
            locationService.partial(filterVariable, true);

            // Disable mouse pointer
            this.drawInteraction.setActive(false);

            // let ev = getAppEvents();
            // console.log(ev);

            // Force dashboard to refresh in particular the datasources
            // let dataSrcSrv = getDataSourceSrv();
            // console.log(dataSrcSrv);
            // let qr = createQueryRunner();
            // qr.run({...this.props.data.request, timeRange: this.props.data.request.range, queries: this.props.data.request.targets});

            // this.props.eventBus.publish(new RefreshEvent());

            // let templSrv = getTemplateSrv();
            // templSrv.getVariables();
            // console.log(templSrv);
            // this.props.eventBus.publish("template-variable-value-updated");
            // let a = getAppEvents();
            // console.log(a);
            // (a as any).emitter.emit(new RefreshEvent());
        }
        );
        
        this.drawInteraction.setActive(false);
        map.addInteraction(this.drawInteraction);
        
        button.addEventListener('click', this.toggleSpatialFilterTool.bind(this), false);

        // https://grafana.com/developers/plugin-tools/create-a-plugin/extend-a-plugin/add-support-for-variables#set-a-variable-from-your-plugin
        let filterVariable: Record<string, any> = {};
        filterVariable['var-' + SpatialFilterControl.CONSTANT_SPATIAL_FILTER_VARIABLE_NAME] = this.currentGeometry;
        locationService.partial(filterVariable, true);
      }
    
      toggleSpatialFilterTool() {
        if (this.isActive === false) {
            this.isActive = true;
            this.drawInteraction.setActive(true);

            // Set icon
            this.icon.className = "bi bi-x-square";
        } else {
            this.isActive = false;
            this.drawInteraction.setActive(false);
            this.drawSource.clear();

            this.currentGeometry = SpatialFilterControl.defaultSpatialFilterGeometry;

            // https://grafana.com/developers/plugin-tools/create-a-plugin/extend-a-plugin/add-support-for-variables#set-a-variable-from-your-plugin
            let filterVariable: Record<string, any> = {};
            filterVariable['var-' + SpatialFilterControl.CONSTANT_SPATIAL_FILTER_VARIABLE_NAME] = this.currentGeometry;
            locationService.partial(filterVariable, true);

            // (getTemplateSrv() as any).index[GeomapPanel.spatialFilterVariableName] = {
            // current: {
            //     value: GeomapPanel.defaultSpatialFilter
            // }
            // };

            // this.props.eventBus.publish(new RefreshEvent());

            // Set icon
            this.icon.className = "bi bi-funnel";
        }

      }
}

export default SpatialFilterControl;
