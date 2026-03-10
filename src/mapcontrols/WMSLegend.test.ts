/**
 * @jest-environment jsdom
 */

import { WMSLegend, LegendItem } from "./WMSLegend";
import { cleanup } from '@testing-library/react';
import { GeomapPanel, Props } from "GeomapPanel";
import { Map } from "ol";
import Zoom from "ol/control/Zoom";
import { act } from "react";
// import {
//   getByLabelText,
//   getByText,
//   getByTestId,
//   queryByTestId,
//   waitFor,
// } from '@testing-library/dom';
// import '@testing-library/jest-dom';

afterEach(cleanup);

describe("Build legend method", () => {
    test("empty legends url array should return empty div array", async () => {
        const wmsLegend: WMSLegend = new WMSLegend([], {}, new GeomapPanel({} as Props));
        const wmsLegendContainer: HTMLDivElement = wmsLegend.buildLegend([]);
        expect(wmsLegendContainer.querySelectorAll("[aria-label*='wms legend image container']")).toHaveLength(0);
    });

    test("legends url array should return same size", () => {
        const legendItems: LegendItem[] = [{label: "", url: ""}, {label: "", url: ""}];
        const wmsLegend: WMSLegend = new WMSLegend(legendItems, {}, new GeomapPanel({} as Props));
        const wmsLegendContainer: HTMLDivElement = wmsLegend.buildLegend(legendItems);
        expect(wmsLegendContainer.querySelectorAll("[aria-label*='wms legend image container']")).toHaveLength(legendItems.length);
    });
});

describe("Get control name", () => {
    test("should return control name", () => {
        const wmsLegend: WMSLegend = new WMSLegend([], {}, new GeomapPanel({} as Props));
        expect(wmsLegend.getControlName()).toBe(WMSLegend.CONTROL_NAME);
    });
});

describe("Test event listener", () => {
    test("click event should build and open legend", () => {
        const items = [{label: "", url: ""}, {label: "", url: ""}];
        const wmsLegend: WMSLegend = new WMSLegend(items, {}, new GeomapPanel({} as Props));
        const el = wmsLegend.getElement();
        const btn = el.getElementsByTagName("button")[0];
        act(() => {
            btn.dispatchEvent(new Event("click"));
        });

        // Get elements that start with 'wms legend image container'
        let wmsLegendContainerCount = 0;
        for (const e of el.getElementsByTagName("div")) {
            if (e.getAttribute("aria-label")?.includes("wms legend image container")) {
                ++wmsLegendContainerCount;
            }
        }
        
        expect(wmsLegend.isLegendOpened() && wmsLegendContainerCount === items.length).toBeTruthy();
    });

    test("click event should close opened legend and remove legend container", () => {
        const items = [{label: "", url: ""}, {label: "", url: ""}];
        const wmsLegend: WMSLegend = new WMSLegend(items, {}, new GeomapPanel({} as Props));
        const el = wmsLegend.getElement();
        const btn = el.getElementsByTagName("button")[0];
        btn.dispatchEvent(new Event("click"));
        btn.dispatchEvent(new Event("click"));
        
        expect(!wmsLegend.isLegendOpened() && el.getElementsByTagName("div").length === 0).toBeTruthy();
    });
});

describe("Remove control from map", () => {
    test("wms legend control should be removed from map", () => {
        const map = new Map({});
        map.addControl(new WMSLegend([], {}, new GeomapPanel({} as Props)));

        WMSLegend.removeWMSLegendControlFromMap(map);

        let wmsLegendControlCounter = 0;
        map.getControls().getArray().forEach((el) => {
            if (el instanceof WMSLegend) {
                ++wmsLegendControlCounter
            }
        });

        expect(wmsLegendControlCounter).toBe(0);
    })
});

describe("tests for getWMSLegendControlFromMap", () => {
    test("emtpy controls array should return undefined", () => {
        const map = new Map();
        const wmsLegendControl = WMSLegend.getWMSLegendControlFromMap(map);

        expect(wmsLegendControl).toBeUndefined();
    });

    test("array without wms legend control should return undefined", () => {
        const map = new Map();
        map.addControl(new Zoom());

        const wmsLegendControl = WMSLegend.getWMSLegendControlFromMap(map);

        expect(wmsLegendControl).toBeUndefined();
    });

    test("array with one wms legend control should return wms legend", () => {
        const map = new Map();
        map.addControl(new WMSLegend([], {}, new GeomapPanel({} as Props)));

        const wmsLegendControl = WMSLegend.getWMSLegendControlFromMap(map);

        expect(wmsLegendControl).toBeTruthy();
    });

    test("array with multiple wms legend controls should return first wms legend", () => {
        const map = new Map();
        const wmsLegendA = new WMSLegend([], {}, new GeomapPanel({} as Props));
        const wmsLegendB = new WMSLegend([], {}, new GeomapPanel({} as Props));
        map.addControl(wmsLegendA);
        map.addControl(wmsLegendB);

        const wmsLegendControl = WMSLegend.getWMSLegendControlFromMap(map);

        expect(wmsLegendControl).toBe(wmsLegendA);
    });
});

describe("tests for addLegendItem", () => {
    test("adding a legend item should increase the legend items by one", () => {
        const l = new WMSLegend([], {}, new GeomapPanel({} as Props));
        l.addLegendItem({
            label: "",
            url: ""
        });

        expect(l.getLegendItems().length).toBe(1);
    });
});

describe("tests for addLegendItems", () => {
    test("adding legend items should increase the legend items length accordingly", () => {
        const l = new WMSLegend([
            {
                label: "",
                url: ""
            }
        ], {}, new GeomapPanel({} as Props));
        l.addLegendItems([
            {
                label: "",
                url: ""
            },
            {
                label: "",
                url: ""
            }
        ]);

        expect(l.getLegendItems().length).toBe(3);
    });
    test("adding an empty array as legend items should increase the legend items length by zero", () => {
        const l = new WMSLegend([], {}, new GeomapPanel({} as Props));
        l.addLegendItems([]);

        expect(l.getLegendItems().length).toBe(0);
    });
});
