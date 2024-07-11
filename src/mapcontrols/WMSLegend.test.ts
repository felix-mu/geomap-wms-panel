import { LegendItem, wms } from "layers/basemaps/wms";
import { WMSLegend } from "./WMSLegend";

describe("Build legend method", () => {
    test("empty legends url array should return empty div array", () => {
        const wmsLegend: WMSLegend = new WMSLegend([]);
        const divElements: HTMLDivElement[] = wmsLegend.buildLegend([]);
        expect(divElements.length).toBe(0);
    });

    test("legends url array should return same size", () => {
        const legendItems: LegendItem[] = [{label: "", url: ""}, {label: "", url: ""}];
        const wmsLegend: WMSLegend = new WMSLegend(legendItems);
        const divElements: HTMLDivElement[] = wmsLegend.buildLegend(legendItems);
        expect(divElements.length).toBe(legendItems.length);
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
        btn.dispatchEvent(new Event("click"));
        
        expect(wmsLegend.isLegendOpened() && el.getElementsByTagName("div").length === items.length + 1).toBeTruthy();
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