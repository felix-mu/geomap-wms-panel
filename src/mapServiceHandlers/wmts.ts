import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';

export async function getWMTSCapabilitiesFromService(wmtsGetCapabilitiesUrl: string): Promise<any> {
    const requestUrl: URL = new URL(wmtsGetCapabilitiesUrl);
    const response: Response = await fetch(requestUrl);

    const parser: WMTSCapabilities = new WMTSCapabilities();
    const wmtsCapabilities = parser.read(await response.text());

    return wmtsCapabilities;
}

export function getWMTSLegendURLForLayer(wmtsCapabilities: any, layerIdentifier: string): string {
    // Get style object for respective layer identifier
    const layers: Array<any> = wmtsCapabilities.Contents.Layer; // wmtsCapabilities["Contents"]["Layer"]
    const layer = layers.find((val) => {
        return val.Identifier === layerIdentifier;
    });

    // Check if there is a style marked to be default
    const defaultStyle = (layer.Style as Array<any>).filter((val) => val.isDefault);
    if (defaultStyle.length > 0) {
        return defaultStyle[0].LegendURL[0].href; // By default return the first legend url
    }

    return (layer.Style as Array<any>)[0].LegendURL[0].href; // By default return the first legend url
}
