import { buildWMSGetLegendURL } from "./wms";

describe("Build the URL to get the legend of a WMS layer", () => {
    test("Malformed base URL with trailing '?' should return correct URL", () => {
        const wmsURL = "https://example-wms.org?"
        const layerName = "testlayer";

        const getLegendURL = buildWMSGetLegendURL(wmsURL, layerName);

        expect(getLegendURL.origin).toEqual(wmsURL.substring(0, wmsURL.length - 1));
        expect(getLegendURL.searchParams.get("request")).toEqual("GetLegendGraphic");
        expect(getLegendURL.searchParams.get("service")).toEqual("WMS");
        expect(getLegendURL.searchParams.get("format")).toEqual("image/png");
        expect(getLegendURL.searchParams.get("layer")).toEqual(layerName);
    });

    test("Malformed base URL with trailing '/' should return correct URL", () => {
        const wmsURL = "https://example-wms.org/"
        const layerName = "testlayer";

        const getLegendURL = buildWMSGetLegendURL(wmsURL, layerName);

        expect(getLegendURL.origin).toEqual(wmsURL.substring(0, wmsURL.length - 1));
        expect(getLegendURL.searchParams.get("request")).toEqual("GetLegendGraphic");
        expect(getLegendURL.searchParams.get("service")).toEqual("WMS");
        expect(getLegendURL.searchParams.get("format")).toEqual("image/png");
        expect(getLegendURL.searchParams.get("layer")).toEqual(layerName);
    });
});
