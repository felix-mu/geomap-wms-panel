import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import { getEPSGLookup, register } from 'ol/proj/proj4';
import proj4 from "proj4";

export async function getWMTSCapabilitiesFromService(wmtsGetCapabilitiesUrl: string): Promise<any> {

    let requestUrl: URL;
    try {
        requestUrl = new URL(wmtsGetCapabilitiesUrl);
    } catch (exception) {
        throw Error("wmtsGetCapabilitiesUrl is not a valid URL");
    }

    const response: Response = await fetch(requestUrl);

    const parser: WMTSCapabilities = new WMTSCapabilities();
    const wmtsCapabilities = parser.read(await response.text());

    return wmtsCapabilities;
}

export function getWMTSLegendURLForLayer(wmtsCapabilities: any/*: {Contents: {Layer: Array<any>}}*/, layerIdentifier: string): string {
    if (!wmtsCapabilities) {
        throw Error("wmtsCapabilites is undefined or null");
    }
    if (!wmtsCapabilities.Contents) {
        throw Error("wmtsCapabilites.Contents is undefined or null");
    }

    if (!wmtsCapabilities.Contents.Layer) {
        throw Error("wmtsCapabilites.Contents.Layer is undefined or null");
    }

    if (wmtsCapabilities.Contents.Layer.length === 0) {
        throw Error("wmtsCapabilites.Contents.Layer.length is 0 and does not contain any elements");
    }

    // Get style object for respective layer identifier
    const layers: any[] = wmtsCapabilities.Contents.Layer; // wmtsCapabilities["Contents"]["Layer"]
    const layer = layers.find((val) => {
        return val.Identifier === layerIdentifier;
    });

    if (!layer) {
        throw Error("layerIdentifier cannot be found");
    }

    // Check if there is a style marked to be default
    const defaultStyle = (layer.Style as any[]).filter((val) => val.isDefault);
    try {
        if (defaultStyle.length > 0) {
            return defaultStyle[0].LegendURL[0].href; // By default return the first legend url
        }

        return (layer.Style as any[])[0].LegendURL[0].href; // By default return the first legend url
    } catch (exception) {
        throw Error("Style element does not contain any legend Urls")
    }
}

export function getWMTSLayers(wmtsCapabilities: any): Array<{ value: any; label: any; }> {
    if (!wmtsCapabilities) {
        throw Error("wmtsCapabilites is undefined or null");
    }
    if (!wmtsCapabilities.Contents) {
        throw Error("wmtsCapabilites.Contents is undefined or null");
    }

    if (!wmtsCapabilities.Contents.Layer) {
        throw Error("wmtsCapabilites.Contents.Layer is undefined or null");
    }

    if (wmtsCapabilities.Contents.Layer.length === 0) {
        throw Error("wmtsCapabilites.Contents.Layer.length is 0 and does not contain any elements");
    }
    const layerArray: any[] = wmtsCapabilities.Contents.Layer;
    let layers: Array<{ value: any; label: any; }> = [];

    layerArray.forEach((el) => {
        layers.push(
            {
              label: el.Title || el.Identifier,
              value: el.Identifier
            }
          );
    });
        
    return layers;
  }

export async function registerCRSInProj4(wmtsCapabilities: any) {
    (wmtsCapabilities.Contents.TileMatrixSet as Array<any>).forEach((el) => {
        try {
            const epsgCode: string = el.SupportedCRS.split(":").slice(-1);
            const epgsLookUp = getEPSGLookup()(parseInt(epsgCode));
            epgsLookUp.then((proj4String: string) => {
                proj4.defs(el.SupportedCRS, proj4String);
                register(proj4);
            });
        } catch (error) {
            throw new Error(`Error registering supported WMTS CRS: ${error}`);
        }

    })
}