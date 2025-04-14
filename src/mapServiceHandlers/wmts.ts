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
    const layers: any[] = wmtsCapabilities.Contents.Layer; // wmtsCapabilities["Contents"]["Layer"]
    const layer = layers.find((val) => {
        return val.Identifier === layerIdentifier;
    });

    // Check if there is a style marked to be default
    const defaultStyle = (layer.Style as any[]).filter((val) => val.isDefault);
    if (defaultStyle.length > 0) {
        return defaultStyle[0].LegendURL[0].href; // By default return the first legend url
    }

    return (layer.Style as any[])[0].LegendURL[0].href; // By default return the first legend url
}

export function getWMTSLayers(wmtsCapabilities: any) {
    const layerArray: any[] = wmtsCapabilities.Contents.Layer;
    let layers: Array<{ value: any; label: any; }> = [];

    layerArray.forEach((el) => {
        layers.push(
            {
              label: el.Title,
              value: el.Identifier
            }
          );
    });
        
    return layers;
  }
