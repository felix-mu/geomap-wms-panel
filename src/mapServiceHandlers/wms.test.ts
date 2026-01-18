import { appendCustomQueryParameters, buildGetCapabilitiesURL, createQueryParameterDictionary, getWMSGetLegendURL } from "./wms";
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

describe("Build getWMSCapabilities URL", () => {
    test("Preserve custom query parameters", () => {
        const testURL = "https://custom-wms.org?customparameterA=a&customparameterB=b";
        const wmsCapabilitiesURL = buildGetCapabilitiesURL(testURL);

        expect(wmsCapabilitiesURL.searchParams.toString()).toEqual(
            "service=WMS&request=GetCapabilities" + "&" + (new URL(testURL).searchParams.toString())
        );
    });
    test("Build correct URL without URL custom query parameters", () => {
        const testURL = "https://custom-wms.org?";
        const wmsCapabilitiesURL = buildGetCapabilitiesURL(testURL);

        expect(wmsCapabilitiesURL.searchParams.toString()).toEqual(
            "service=WMS&request=GetCapabilities"
        );
    });
});

describe("Create query parameter dictionary", () => {
    test("return correct dictionary of query parameters", () => {
        const url = "https://custom-wms.org?customparameterA=a&customparameterB=b";
        const qpDict = createQueryParameterDictionary(url);
        const expectedResult = {
            customparameterA: "a",
            customparameterB: "b"
        };

        expect(qpDict["customparameterA"]).toEqual(expectedResult["customparameterA"]);
        expect(qpDict["customparameterB"]).toEqual(expectedResult["customparameterB"]);
    });

    test("return empty dictionary of query parameters", () => {
        const url = "https://custom-wms.org?";
        const qpDict = createQueryParameterDictionary(url);

        expect(qpDict).toEqual({});
    });

    test("return correct dictionary of incomplete query parameters", () => {
        const url = "https://custom-wms.org?a=&b=12&c";
        const qpDict = createQueryParameterDictionary(url);

        expect(qpDict).toEqual({
            a: "",
            b: "12",
            c: ""
        });
    });
});

describe("Append custom query parameters", () => {
    test("original URL w/o query parameters and no custom query parameter", () => {
        const url = decodeURI(new URL("https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png").toString());
        const customSearchParams = new URL("https://example.org").searchParams;
        const appendedURL = appendCustomQueryParameters(url, customSearchParams);

        expect(appendedURL).toBe(url);
    });

    test("original URL with query parameters and no custom query parameter", () => {
        const url = decodeURI(new URL("https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b").toString());
        const customSearchParams = new URL("https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png").searchParams;
        const appendedURL = appendCustomQueryParameters(url, customSearchParams);

        expect(appendedURL).toBe(url + "=");
    });

    test("original URL with query parameters and custom query parameter", () => {
        const url = decodeURI(new URL("https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=").toString());
        const customSearchParams = new URL("https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?c=test&custom=jdjdjd").searchParams;
        const appendedURL = appendCustomQueryParameters(url, customSearchParams);

        expect(appendedURL).toBe(url + "&" + customSearchParams.toString());
    });

    test("invalid original URL with query parameters and custom query parameter", () => {
        const customSearchParams = new URL("https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?c=test&custom=jdjdjd").searchParams;
        expect.assertions(1);
        try {
            appendCustomQueryParameters(":?a=1&b", customSearchParams);
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });
});
