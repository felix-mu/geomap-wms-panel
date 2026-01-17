import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import { getEPSGLookup, register } from 'ol/proj/proj4';
import { get } from 'ol/proj';
import proj4 from "proj4";
import { Options } from 'ol/source/WMTS';

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
    await Promise.all(
         (wmtsCapabilities.Contents.TileMatrixSet as any[]).map(async (el) => {
                try {
                    // Skip if CRS is already registered
                    if (get(el.SupportedCRS)) {
                        return;
                    }

                    const epsgCode: string = el.SupportedCRS.split(":").slice(-1);
                    // const epsgLookUp = getEPSGLookup()(parseInt(epsgCode));
                    // epsgLookUp.then((proj4String: string) => {
                    //     proj4.defs(el.SupportedCRS, proj4String);
                    //     register(proj4);
                    // });
                    const proj4String = await getEPSGLookup()(parseInt(epsgCode, 10));
                    proj4.defs(el.SupportedCRS, proj4String);
                    register(proj4);
                } catch (error) {
                    throw new Error(`Error registering supported WMTS CRS: ${error}`);
                }
            })
    );
}

// Add custom parameters
export function addCustomParametersToWMTSOptionsURLs(wmtsURL: string, wmtsOptions: Options): Options {
    const url = new URL(wmtsURL);
    const urlSearchParams = removeQueryParameters(url.searchParams);

    if(wmtsOptions.url) {
        const url_tmp = appendCustomQueryParameters(wmtsOptions.url, urlSearchParams);
        wmtsOptions = {...wmtsOptions, "url": decodeURI(url_tmp)};
    }

    if(wmtsOptions.urls) {
        const urls_tmp = wmtsOptions.urls.map((url_i) => {
            const url_tmp = appendCustomQueryParameters(url_i, urlSearchParams);
            return url_tmp;
        });
        wmtsOptions = {...wmtsOptions, "urls": urls_tmp};
    }

    return wmtsOptions;
}

// TODO: add unit tests
export function removeQueryParameters(urlSearchParams: URLSearchParams,
    parameterNames: string[] = [
        "request",
        "version",
        "service"
    ],
    ignoreCase = true
    ): URLSearchParams {
    for (const key of [...urlSearchParams.keys()]) {
        const key_tmp = ignoreCase ? key.toLowerCase() : key;
        parameterNames.forEach((param) => {
            const param_tmp = ignoreCase ? param.toLowerCase() : param;

            if (key_tmp === param_tmp) {
                urlSearchParams.delete(key);
            }
        });
    }
    
    return urlSearchParams;
}

// TODO: add unit tests
export function appendCustomQueryParameters(originalUrl: string, customQueryParameter: URLSearchParams): string {
    try {
        if ([...new URL(originalUrl).searchParams.keys()].length > 0) {
            return decodeURI(
                [
                    new URL(originalUrl).origin + (new URL(originalUrl).pathname.length > 1 ? new URL(originalUrl).pathname : "")
                    + "?" + new URL(originalUrl).searchParams.toString(), 
                    customQueryParameter.toString()
                ].filter(e => e.length > 0).join("&")
            );
        } else {
            return decodeURI(
                [
                    new URL(originalUrl).origin + (new URL(originalUrl).pathname.length > 1 ? new URL(originalUrl).pathname : ""),
                    customQueryParameter.toString()
                ].filter(e => e.length > 0).join("?")
            );
        }
    } catch (error) {
        throw new Error(`Error apppending custom query parameters: ${error}`);
    }
}
