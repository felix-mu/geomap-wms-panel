import Map from 'ol/Map';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

import { ExtendMapLayerOptions, ExtendMapLayerRegistryItem } from 'extension';
// import {
//   PanelOptionsEditorBuilder, //FieldOverrideContext,
// // PanelOptionsEditorBuilder,
// } from '@grafana/data';
import { MultipleWMSEditor } from 'editor/MultipleWMSEditor';
import LayerGroup from 'ol/layer/Group';
import BaseLayer from 'ol/layer/Base';
import { getWMSCapabilitiesFromService, getProjection, getWMSGetLegendURL } from 'mapServiceHandlers/wms';
import { WMSLegend } from 'mapcontrols/WMSLegend';

// import {
  // RefreshEvent,
  // RefreshEvent,
  // getAppEvents
  // } from '@grafana/runtime';


// Constants
// Since the constants are global they should be set each time the panel is accessed
// let optionsBuilder: PanelOptionsEditorBuilder<ExtendMapLayerOptions>;
type WMSTuple = {
  title: string,
  name: string
}

export type LegendItem = {
  label: string,
  url: string
}

export interface WMSConfig {
    url: string,
    layers: WMSTuple[],
    opacity: number,
    attribution: string,
    showLegend: boolean
}

export interface WMSBaselayerConfig {
  wmsBaselayer: WMSConfig[],
  // attribution: string,
}

export const wms: ExtendMapLayerRegistryItem<WMSBaselayerConfig> = {
  id: 'wms',
  name: 'OGC Web Map Service',
  description: 'Add an OGC Web Map Service',
  isBaseMap: true,
  showOpacity: true,

  /**
   * Function that configures transformation and returns a transformer
   * @param options
   */
  create: async (map: Map, options: ExtendMapLayerOptions<WMSBaselayerConfig>) => {
    // Remove previous legend control if it exists
    WMSLegend.removeWMSLegendControlFromMap(map);

    let layers: BaseLayer[] = [];
    let legendItems: LegendItem[] = [];
    const cfg = { ...options.config };

    if (cfg.wmsBaselayer) {
      for (let wmsItem of cfg.wmsBaselayer) {
        let xmlNodeWMS: Node | undefined;
        let epsgCode: string;
        let selectedWmsLayers: WMSTuple[] = [];
    
        // Set selectedWmsLayer to empty array if accessed in edit mode for the first time
        selectedWmsLayers = !wmsItem || /*wmsItem.wms === undefined ||*/ ((wmsItem.layers as unknown) as string) === "" ? [] : wmsItem.layers;
    
        // This happens in edit mode when the WMS url changes
        // This will fail if the panel is opened in edit mode for the first time
        try {
          xmlNodeWMS = await getWMSCapabilitiesFromService(wmsItem.url as string);
          epsgCode = await getProjection(xmlNodeWMS!) as string;
        } catch (error) {
          epsgCode = "EPSG:3857";
          selectedWmsLayers = [];
        }

        if (selectedWmsLayers.length !== 0) {
          const wmsSource = new ImageWMS({
            url: wmsItem.url as string,
            params: {"LAYERS": selectedWmsLayers.map(el => el.name).join(',')},
            ratio: 1,
            crossOrigin: 'anonymous', // https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
            attributions: wmsItem.attribution ? wmsItem.attribution : "", // Testing purposes
            projection: epsgCode
          });
          layers.push(
            new ImageLayer({
              source: wmsSource,
              opacity: wmsItem.opacity ?? 1.0
            })
          );

          if (wmsItem.showLegend){
            const wmsURL = wmsSource.getUrl();
            selectedWmsLayers.forEach((value) => legendItems.push(
                {
                  label: value.title,
                  url: wmsURL ? getWMSGetLegendURL(xmlNodeWMS!, value.name) ?? "" : "" // wmsURL +`?service=WMS&request=GetLegendGraphic&format=image%2Fpng&layer=${value.name}`
                }
              )
            );
          }
        }
      }
    }

    if (legendItems.length > 0) {
      map.addControl(new WMSLegend(legendItems));
    }

    // Dummy promise returns epsgCode from the constants which is then used to initialize the image layer
    return ({
        init: () => {
          // console.log(crsCode);          
          return new LayerGroup({
            layers: [
              ...layers
            ],
            opacity: options.opacity ?? 1.0
          });
        }
      })
  },
	
	registerOptionsUI: async (builder) => {
    // let options: any[] = [];
    // if (optionsBuilder !== undefined) {
    //   options = optionsBuilder.getItems().filter((el) => {
    //     return el["id"] === 'config.layer';
    //   })[0].settings.options
    // }

    builder
    .addCustomEditor(
      {
        id: 'wms-layers',
        // name: 'URL',
        name: 'WMS',
        path: 'config.wmsBaselayer',
        // description: 'URL to WMS endpoint (required)',
        // description: 'WMS',
        editor: MultipleWMSEditor,
      }
    );
    // .addTextInput({
    //   path: 'config.attribution',
    //   name: 'Attribution (optional)'
    // });

      // optionsBuilder = builder;
    },
};

export const wmsLayers = [wms];
