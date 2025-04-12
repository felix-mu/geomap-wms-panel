import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';

export async function getWMTSCapabilitiesFromService(wmtsGetCapabilitiesUrl: string): Promise<any> {
    const requestUrl: URL = new URL(wmtsGetCapabilitiesUrl);
    const response: Response = await fetch(requestUrl);

    const parser: WMTSCapabilities = new WMTSCapabilities();
    const wmtsCapabilities = parser.read(await response.text());

    return wmtsCapabilities;
}