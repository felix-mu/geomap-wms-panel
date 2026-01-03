/**
 * @jest-environment jsdom
 */

// import { LegendItem } from "layers/basemaps/wms";
import { LegendItem } from "layers/basemaps/wms";
import { WMSLegend } from "./WMSLegend";
import { cleanup, render, screen} from '@testing-library/react';
import { Map } from "ol";
import React, { act } from "react";

afterEach(cleanup);

describe("Build legend method", () => {
    test("empty legends url array should return empty div array", async () => {
        const wmsLegend: WMSLegend = new WMSLegend([]);
        const wmsLegendContainer: React.JSX.Element = wmsLegend.buildLegend([]);
        render(wmsLegendContainer);
        expect(screen.queryAllByLabelText (/^wms legend image container/i)).toHaveLength(0);
    });

    test("legends url array should return same size", () => {
        const legendItems: LegendItem[] = [{label: "", url: ""}, {label: "", url: ""}];
        const wmsLegend: WMSLegend = new WMSLegend(legendItems);
        const wmsLegendContainer: React.JSX.Element = wmsLegend.buildLegend(legendItems);
        render(wmsLegendContainer);
        expect(screen.queryAllByLabelText (/^wms legend image container/i)).toHaveLength(legendItems.length);
    });
});

describe("Get control name", () => {
    test("should return control name", () => {
        const wmsLegend: WMSLegend = new WMSLegend([]);
        expect(wmsLegend.getControlName()).toBe(WMSLegend.CONTROL_NAME);
    });
});

describe("Test event listener", () => {
    test("click event should build and open legend", () => {
        const items = [{label: "", url: ""}, {label: "", url: ""}];
        const wmsLegend: WMSLegend = new WMSLegend(items);
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
        const wmsLegend: WMSLegend = new WMSLegend(items);
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
        map.addControl(new WMSLegend([]));

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
