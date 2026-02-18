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
import { getWMSCapabilitiesFromService, getProjection, getWMSGetLegendURL, appendCustomQueryParameters } from 'mapServiceHandlers/wms';
import { LegendItem, WMSLegend } from 'mapcontrols/WMSLegend';

// import {
  // RefreshEvent,
  // RefreshEvent,
  // getAppEvents
  // } from '@grafana/runtime';

type WMSTuple = {
  title: string,
  name: string
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
    // Remove previous legend control if it exists and the layer is used as basemap
    // If the layer is used as map layer do not remove the legend but append the legend entries
    if (!options.basemapUsedAsMapLayer) {
      WMSLegend.removeWMSLegendControlFromMap(map);
    }

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
            attributions: wmsItem.attribution ? wmsItem.attribution : "",
            projection: epsgCode
          });
          layers.push(
            new ImageLayer({
              source: wmsSource,
              opacity: wmsItem.opacity ?? 1.0,
            })
          );

          if (wmsItem.showLegend){
            const wmsURL = wmsSource.getUrl();
            selectedWmsLayers.forEach((value) => {
              let wmsLegendURL;
              try {
                // Append custom query parameters to legend urls
                wmsLegendURL = getWMSGetLegendURL(xmlNodeWMS!, value.name);
                wmsLegendURL = appendCustomQueryParameters(
                    wmsLegendURL ?? "", 
                    new URL(wmsURL!).searchParams
                  );
              } catch (error) {
                wmsLegendURL = wmsLegendURL ?? "";
              }
              legendItems.push(
                {
                  label: value.title,
                  // Append custom query parameters to legend urls
                  url: wmsLegendURL
                }
              )
            }
            );
          }
        }
      }
    }

    if (legendItems.length > 0) {
      if (!options.basemapUsedAsMapLayer || !WMSLegend.getWMSLegendControlFromMap(map!)) {  // If the basemap layer does not provide a WMSLegend a new one has to be created
        map.addControl(new WMSLegend(legendItems));
      } else {
        // Append legend items if baselayer is used as map layer
        WMSLegend.getWMSLegendControlFromMap(map!)?.addLegendItems(legendItems);
        // INFO: There is no need to remove the items from the WMS legend when the toggle for a baselayer used as map layer is 
        // deactivated because the options change is propgated to the top level and also the basemap layers are re-initialized
        // so the previous WMS legend is removed and a new (empty) one is created that is filled with the new configuration
      }
    }

    // Dummy promise returns epsgCode from the constants which is then used to initialize the image layer
    return ({
        init: () => {
          // console.log(crsCode);          
          return new LayerGroup({
            ...options,
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
