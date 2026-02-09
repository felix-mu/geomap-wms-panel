import { GeomapHoverPayload } from "event";
import { convertMapViewExtent2LonLat, copy2ClipBoardDataAsJSON } from "./tootltipUtils";
import { DataFrame, FieldType } from "@grafana/data";

describe("tests for convertMapViewExtent2LonLat", () => {
    test("length < 4 of extent array should throw an error", () => {
        expect(() => convertMapViewExtent2LonLat([1,2], "")).toThrow();
    });

    test("empty extent array should throw an error", () => {
        expect(() => convertMapViewExtent2LonLat([], "")).toThrow();
    });

    test.each([
        {
            extent: [
                1239498.002,
                6106555.384,
                1330156.595,
                6158834.679
            ],
            epsgCode: ""
        },
        {
            extent: [
                1239498.002,
                6106555.384,
                1330156.595,
                6158834.679
            ],
            epsgCode: "1234"
        }
    ])("invalid or unregistered EPSG code should throw an error", ({extent, epsgCode}) => {
        expect(() => convertMapViewExtent2LonLat(extent, epsgCode)).toThrow();
    });

    test("invalid extent coordinates should throw an error", () => {
        const extent = [
                1239498.002,
                6106555.384,
                1330156.595,
                6158834.679
            ];
        const epsgCode = "EPSG:3857";
        const convertedLonLat = convertMapViewExtent2LonLat(extent, epsgCode);
        expect({
            minLonLat: {
                lon: convertedLonLat.minLonLat.lon.toFixed(4),
                lat: convertedLonLat.minLonLat.lat.toFixed(4)
            },
            maxLonLat: {
                lon: convertedLonLat.maxLonLat.lon.toFixed(4),
                lat: convertedLonLat.maxLonLat.lat.toFixed(4)
            }
        }).toEqual({
            minLonLat: {
                lon: "11.1346",
                lat: "47.9982"
            },
            maxLonLat: {
                lon: "11.9490",
                lat: "48.3115"
            }
        });
    });
});

describe("tests for copy2ClipBoardDataAsJSON", () => {
    test("undefined propsToShow should return empty json object", () => {
        const payload = {
            propsToShow: undefined
        };

        expect(copy2ClipBoardDataAsJSON(payload as GeomapHoverPayload)).toEqual("{}");
    });

    test("empty propsToShow array should return empty json object", () => {
        const payload = {
            propsToShow: []
        };

        expect(copy2ClipBoardDataAsJSON((payload as any) as GeomapHoverPayload)).toEqual("{}");
    });

    test("propsToShow array should return json object", () => {
        const dataframe: DataFrame = {
            name: "",
            length: 2,
            fields: [
                {
                    name: "test",
                    type: FieldType.number,
                    config: {
                        "displayName": "test display name"
                    },
                    values: [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    name: "test2",
                    type: FieldType.number,
                    config: {
                        "displayName": "test2 display name"
                    },
                    values: [
                        1,
                        2,
                        3,
                        4
                    ]
                }
            ]
        };
        const payload = {
            rowIndex: 2,
            propsToShow: [
                {
                    name: "test",
                    type: FieldType.number,
                    config: {
                        "displayName": "test display name"
                    },
                    values: [
                        1,
                        2,
                        3,
                        4
                    ]
                }
            ],
            data: dataframe
        };

        expect(copy2ClipBoardDataAsJSON((payload as any) as GeomapHoverPayload)).toEqual('{"test display name":3}');
    });
    
    test("propsToShow with invalid rowIndex should return json object with null as value", () => {
        const dataframe: DataFrame = {
            name: "",
            length: 2,
            fields: [
                {
                    name: "test",
                    type: FieldType.number,
                    config: {
                        "displayName": "test display name"
                    },
                    values: []
                },
                {
                    name: "test2",
                    type: FieldType.number,
                    config: {
                        "displayName": "test2 display name"
                    },
                    values: []
                }
            ]
        };
        const payload = {
            rowIndex: 2,
            propsToShow: [
                {
                    name: "test",
                    type: FieldType.number,
                    config: {
                        "displayName": "test display name"
                    },
                    values: []
                }
            ],
            data: dataframe
        };

        expect(copy2ClipBoardDataAsJSON((payload as any) as GeomapHoverPayload)).toEqual('{"test display name":null}');
    });

    test("propsToShow with undefined rowIndex should return json object with null as value", () => {
        const dataframe: DataFrame = {
            name: "",
            length: 2,
            fields: [
                {
                    name: "test",
                    type: FieldType.number,
                    config: {
                        "displayName": "test display name"
                    },
                    values: []
                },
                {
                    name: "test2",
                    type: FieldType.number,
                    config: {
                        "displayName": "test2 display name"
                    },
                    values: []
                }
            ]
        };
        const payload = {
            rowIndex: 2,
            propsToShow: [
                {
                    name: "test2",
                    type: FieldType.number,
                    config: {
                        "displayName": "test display name"
                    },
                    values: []
                }
            ],
            data: dataframe
        };

        expect(copy2ClipBoardDataAsJSON((payload as any) as GeomapHoverPayload)).toEqual('{"test2 display name":null}');
    });
});
