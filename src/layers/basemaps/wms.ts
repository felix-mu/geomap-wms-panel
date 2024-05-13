import Map from 'ol/Map';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import {register} from 'ol/proj/proj4.js';

import { ExtendMapLayerOptions, ExtendMapLayerRegistryItem } from 'extension';
import proj4 from 'proj4';
// import {
//   PanelOptionsEditorBuilder, //FieldOverrideContext,
// // PanelOptionsEditorBuilder,
// } from '@grafana/data';
import { CustomWMSBasemapEditor } from 'editor/CustomWMSBasemapEditor';
// import {
  // RefreshEvent,
  // RefreshEvent,
  // getAppEvents
  // } from '@grafana/runtime';

//________________________
export function getFirstDirectChildNodeByLocalName(childNodes: NodeListOf<ChildNode>, localNodeName: string): any {
  for (let childNode of childNodes) {
    if (childNode.nodeName === localNodeName) {
      return childNode;
    }
  }
  return undefined;
}

export function getAllDirectChildNodesByLocalName(childNodes: NodeListOf<ChildNode>, localNodeName: string): ChildNode[] {
  let childNodesList = [];
  for (let childNode of childNodes) {
    if (childNode.nodeName === localNodeName) {
      childNodesList.push(childNode);
    }
  }
  return childNodesList;
}

export async function getProjDefinition(urlAsString: URL): Promise<string> {
  const response = await fetch(urlAsString);
  const projDef = await response.text();
  return projDef;
}

export async function getWMSCapabilitiesFromService(url: string): Promise<Node> {
  // console.log(url);
  const wmsCapabilitesURL = new URL(url);
  wmsCapabilitesURL.search = "?service=WMS&request=GetCapabilities";
  // console.log(url);

	const responseCapabilities = await fetch(wmsCapabilitesURL);
	const xmlCapabilities = await responseCapabilities.text();
	// console.log(xmlCapabilities);

	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(xmlCapabilities, "text/xml");
	// console.log(xmlDoc);

  const capabilityNode = xmlDoc.documentElement.getElementsByTagName("Capability")[0];

  return capabilityNode;
}

export async function getProjection(capabilityNode: Node): Promise<string | undefined> {
  const defaultOpenlayersEPSGCode = "EPSG:3857";
  let layerNode_parent = getFirstDirectChildNodeByLocalName(capabilityNode.childNodes, "Layer");

  const epsgIOBaseURL = "https://epsg.io/";
  const epsgCodes: { [epsg: string]: URL } = {};
  try {
    getAllDirectChildNodesByLocalName(layerNode_parent.childNodes, "CRS").forEach(
      (element) => {
        let epsgCode = element.textContent === null ? "" : element.textContent;
  
        // Skip if the prefix is e.g. CRS:
        if (epsgCode.split(":")[0] !== "EPSG") {
          return;
        }
        
        return epsgCodes[epsgCode] = new URL(`${epsgCode.split(":").slice(-1)}.proj4`, epsgIOBaseURL);
      }
    );
  } catch (error) {
    
  }

  // console.log(epsgCodes);

  let proj4String = undefined; // If this stays undefined no transformation is needed since WMS supports the default CRS
  
  if (typeof epsgCodes[defaultOpenlayersEPSGCode] === 'undefined') {
    // Take first entry of EPSG codes
    proj4String = await getProjDefinition(epsgCodes[Object.keys(epsgCodes)[0]]);
  }

  // console.log(proj4String);

  if (typeof proj4String !== 'undefined') {
    const firstEPSGCode = Object.keys(epsgCodes)[0];
    proj4.defs(
      firstEPSGCode,
      proj4String
    );
    register(proj4);
    return firstEPSGCode;
  } else {
    return defaultOpenlayersEPSGCode; 
  }
}

// function getQueryableLayers(capabilityNode: Node) {
//   let layerNode_parent = getFirstDirectChildNodeByLocalName(capabilityNode.childNodes, "Layer");
//   return getAllDirectChildNodesByLocalName(layerNode_parent.childNodes, "Layer").filter(
//     (element) => {
//       try {
//         let attr = (element as Element).attributes.getNamedItem("queryable");
//         return attr != null && attr.value === '1';
//       } catch (error) {
//         return false;
//       }
//     }
//   );
// }

export function getWMSLayers(capaNode: Node) {
  let layers = [];
  let layerNodes = (capaNode as Element).getElementsByTagName("Layer");
  // Traverse through layers and add selection options to optBuilder
  for (let layer of layerNodes) {
    let layerTitleNode = getFirstDirectChildNodeByLocalName(layer.childNodes, "Title");
    let layerNameNode = getFirstDirectChildNodeByLocalName(layer.childNodes, "Name");

    if (layerNameNode === undefined) {
      continue;
    };
    
    let layerTitle = layerTitleNode !== undefined ? layerTitleNode.textContent : layerNameNode.textContent;
    let layerName = layerNameNode.textContent;

    layers.push(
      {
        value: layerName,
        label: layerTitle
      }
    );
    
  }

  return layers;
}


export function addWMSLayerSelect(optionBuilderLayerSelect: any, capaNode: Node) {
  // 06-042_OpenGIS_Web_Map_Service_WMS_Implementation_Specification 7.2.4.6.3 Name: "If, and only if, a layer has a <Name>, then it is a map layer that can be requested by using that Name in the
  // LAYERS parameter of a GetMap request"
  
  // let queryableLayerNodes = getQueryableLayers(capaNode);

  // Since the object is passed by reference assigning an empty array does not have an effect
  // https://stackoverflow.com/questions/13104494/does-javascript-pass-by-reference
  // https://stackoverflow.com/questions/31909838/why-does-overwriting-a-whole-array-within-a-function-not-replace-it-but-overwri
  // and in particular: https://www.javascripttutorial.net/javascript-pass-by-value/
  optionBuilderLayerSelect.settings.options.splice(0, optionBuilderLayerSelect.settings.options.length);

  let layerNodes = (capaNode as Element).getElementsByTagName("Layer");
  
  // Traverse through layers and add selection options to optBuilder
  for (let layer of layerNodes) {
    let layerTitleNode = getFirstDirectChildNodeByLocalName(layer.childNodes, "Title");
    let layerNameNode = getFirstDirectChildNodeByLocalName(layer.childNodes, "Name");

    if (layerNameNode === undefined) {
      continue;
    };
    
    let layerTitle = layerTitleNode !== undefined ? layerTitleNode.textContent : layerNameNode.textContent;
    let layerName = layerNameNode.textContent;

    optionBuilderLayerSelect.settings.options.push(
      {
        value: layerName,
        label: layerTitle
      }
    );
    
  }

  return optionBuilderLayerSelect;
}


// Constants
// Since the constants are global they should be set each time the panel is accessed
// let optionsBuilder: PanelOptionsEditorBuilder<ExtendMapLayerOptions>;

//_______________________________________________________

export interface WMSConfig {
  wms: {
    url: string;
    layers: string[];
  },
  attribution: string
}

export const wms: ExtendMapLayerRegistryItem<WMSConfig> = {
  id: 'wms',
  name: 'OGC Web Map Service',
  description: 'Add an OGC Web Map Service',
  isBaseMap: true,

  /**
   * Function that configures transformation and returns a transformer
   * @param options
   */
/*   create: async (map: Map, options: ExtendMapLayerOptions<WMSConfig>) => ({
    init: () => {
	  const cfg = { ...options.config };
      return new ImageLayer({
		//extent: [-13884991, 2870341, -7455066, 6338219],
		source: new ImageWMS({
			// url: 'https://geoportal.muenchen.de/geoserver/gsm/wms',
			url: cfg.url as string,
			// params: {'LAYERS': 'g_stadtkarte_gesamt_gray'},
			params: {"Layers": cfg.layer},
			ratio: 1,
			// serverType: 'geoserver',
			crossOrigin: 'anonymous',
			attributions: cfg.attribution,
			}),
		});
		}
	}), */
  create: async (map: Map, options: ExtendMapLayerOptions<WMSConfig>) => {
    const cfg = { ...options.config };
    let xmlNodeWMS: Node | undefined;
    let epsgCode: string;
    // let wmsLayerList: any[] = [];
    let selectedWmsLayers: string[] = [];

    // Set selectedWmsLayer to empty array if accessed in edit mode for the first time
    selectedWmsLayers = !cfg.wms || cfg.wms!.layers === undefined || ((cfg.wms!.layers as unknown) as string) === "" ? [] : cfg.wms!.layers;

    // This happens in edit mode when the WMS url changes
    // This will fail if the panel is opened in edit mode for the first time
    try {
      xmlNodeWMS = await getWMSCapabilitiesFromService(cfg.wms!.url as string);
      epsgCode = await getProjection(xmlNodeWMS!) as string;
      // wmsLayerList = getWMSLayers(xmlNodeWMS);
    } catch (error) {
      epsgCode = "EPSG:3857";
      selectedWmsLayers = [];
    }

    // If undefined panel was initially not in edit mode but only loaded in dashboard
    // If the panel would be in edit mode the optionsBuilder was defined in registerOptionsUI and is therefore not undefined
    // This happens on every entry in the edit mode
    // if (optionsBuilder !== undefined) {
    //   try {
    //     addWMSLayerSelect(optionsBuilder.getItems().filter((el) => {
    //       return el["id"] === 'config.layer';
    //     })[0], xmlNodeWMS!);
    //     // addWMSLayersToSelectOptions(optionsBuilder.getItems().filter((el) => {
    //     //     return el["id"] === 'config.layer';
    //     //   })[0], wmsLayerList);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    // Dummy promise returns epsgCode from the constants which is then used to initialize the image layer
    return new Promise<string>((resolve) => { resolve(epsgCode) }).then((crsCode) => ({ // Promise.resolve(epsgCode)
        init: () => {
          // console.log(crsCode);

          // const layers = Array(cfg.layer).join(',');
          // selectedWmsLayers = selectedWmsLayers.filter((layerName) => {
          //   for (let lyr of wmsLayerList) {
          //     if (lyr.value === layerName) {
          //       return true;
          //     }
          //   }
          //   return false;
          // });
          const layers = Array(selectedWmsLayers).join(',');

          if (layers.length === 0) {
            return new ImageLayer();
          }
          
          return new ImageLayer(
              {
              //extent: [-13884991, 2870341, -7455066, 6338219],
              source: new ImageWMS({
                  // url: 'https://geoportal.muenchen.de/geoserver/gsm/wms',
                  url: cfg.wms!.url as string,
                  // params: {'LAYERS': 'g_stadtkarte_gesamt_gray'},
                  params: {"Layers": layers},
                  ratio: 1,
                  // serverType: 'geoserver',
                  crossOrigin: 'anonymous', // https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
                  attributions: cfg.attribution,
                  projection: crsCode
                })

              }
            );
        }
      })
    )
  },
	
	registerOptionsUI: async (builder) => {
    // let options: any[] = [];
    // if (optionsBuilder !== undefined) {
    //   options = optionsBuilder.getItems().filter((el) => {
    //     return el["id"] === 'config.layer';
    //   })[0].settings.options
    // }

    builder
    // .addCustomEditor(
    //   {
    //     id: 'wsm-url',
    //     path: 'config.url', // Path to 'config' object to property 'url'
    //     name: 'URL *',
    //     description: 'URL to WMS endpoint (required)',
    //     editor: CustomWMSBasemapURLEditor,
    //   }
    // )
    .addCustomEditor(
      {
        id: 'wsm-layers',
        name: 'URL',
        path: 'config.wms',
        description: 'URL to WMS endpoint (required)',
        editor: CustomWMSBasemapEditor,
      }
    )
      // .addTextInput({
      //   path: 'config.url', // Path to 'config' object to property 'url'
      //   name: 'URL *',
      //   description: 'URL to WMS endpoint (required)',
      // })
      // .addMultiSelect({
      //   name: 'Layers',
      //   path: 'config.layer',
      //   description: 'Select the layers to be displayed in base map',
      //   settings: {
      //     options: [],
      //     // options: [
      //     //   { value: "Test", label: 'Percent' },
      //     //   { value: "PieChartLabels.Name", label: 'Name' },
      //     //   { value: "PieChartLabels.Value", label: 'Value' },
      //     // ],
      //     // getOptions is called with context and the config is therefore available
      //     // See: https://github.com/grafana/grafana/blob/fba2b6140851f57f9de7f93e25031ea1ecd3717f/public/app/plugins/panel/stat/common.ts#L69
      //     // and src/editor/LayerEditor in line 163
      //     getOptions: async (context: FieldOverrideContext) => {
      //       // const opts: any[] = [];
      //       if (context && context.options && context.options.config) {
      //         try {
      //           let xmlNodeWMS = await getWMSCapabilitiesFromService(context.options.config.url as string);
      //           // const opts = getWMSLayers(xmlNodeWMS);
      //           addWMSLayerSelect(optionsBuilder.getItems().filter((el) => {
      //             return el["id"] === 'config.layer';
      //           })[0], xmlNodeWMS!);
      //           return []; // Promise.resolve(opts);
      //         } catch (error) {
    
      //         }
      //       }
      //       return [];
      //     }
      //   },
      //   // showIf: (cfg) => cfg.config?.url !== undefined,
      // })
      .addTextInput({
        path: 'config.attribution',
        name: 'Attribution (optional)'
      });

      // optionsBuilder = builder;
    },
};

export const wmsLayers = [wms];
