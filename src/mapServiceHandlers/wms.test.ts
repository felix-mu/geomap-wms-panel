import { getWMSGetLegendURL } from "./wms";
import { xmlCapabilities } from "../layers/basemaps/wms.test";

let capabilityNode: Element;

beforeAll(() => {
    const parser: DOMParser = new DOMParser();
    const xmlDoc: Document = parser.parseFromString(xmlCapabilities, "text/xml");
    capabilityNode = xmlDoc.documentElement.getElementsByTagName("Capability")[0];
})

describe("Build the URL to get the legend of a WMS layer", () => {
    test("Get URL for existing layer name", () => {
        const layerName = "web";
        const getLegendURL = getWMSGetLegendURL(capabilityNode, layerName);
        expect(getLegendURL).toEqual("https://sgx.geodatenzentrum.de/wms_topplus_open?format=image%2Fpng&layer=web&sld_version=1.1.0&request=GetLegendGraphic&service=WMS&version=1.1.1&styles=");
        // https://sgx.geodatenzentrum.de/wms_topplus_open?format=image%2Fpng&layer=web&sld_version=1.1.0&request=GetLegendGraphic&service=WMS&version=1.1.1&styles=
    });

    test("Get URL for not existing layer name should return undefined", () => {
        const layerName = "testlayer";
        const getLegendURL = getWMSGetLegendURL(capabilityNode, layerName);
        expect(getLegendURL).toBeUndefined()
    });
});
