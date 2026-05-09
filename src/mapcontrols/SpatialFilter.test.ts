import { DrawEvent } from "ol/interaction/Draw";
import SpatialFilterControl from "./SpatialFilter";
import Map from 'ol/Map';
import Feature from 'ol/Feature.js';
import Polygon from 'ol/geom/Polygon.js';
import WKT from 'ol/format/WKT.js';

import '@testing-library/jest-dom';

// Create SpatialFilter before tests are run
const targetElement: HTMLDivElement = document.createElement("div");
const map = new Map({target: targetElement});
const spatialCtlr: SpatialFilterControl = new SpatialFilterControl(map, {}, {});
map.addControl(spatialCtlr);

describe("State of the spatial filter control", () => {
    test("Default state of the spatial control should be inactive", () => {
        expect(spatialCtlr.isActive).toBeFalsy();
        expect(spatialCtlr.currentGeometry).toBe(SpatialFilterControl.defaultSpatialFilterGeometry);
    });

    test("A click enables the spatial filter control", () => {
        (spatialCtlr as any).element.getElementsByTagName("button")[0].click();
        expect(spatialCtlr.isActive).toBeTruthy();
    });

    test("Draw a polygon and update the current filter geometry", () => {
        const featureGeometry: Polygon =  new Polygon(
            [
                [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 0.0]]
            ]
        );
        const spatialCtlr: SpatialFilterControl = new SpatialFilterControl(new Map(), {}, {});
        const event = new DrawEvent("drawend", new Feature(featureGeometry));
        spatialCtlr.drawInteraction.dispatchEvent(event);
        
        expect(new WKT().writeGeometry(featureGeometry)).toBe(spatialCtlr.currentGeometry);

    });

    test("A second click deactivates the spatial filter control and sets the geometry to the default geometry", () => {
        (spatialCtlr as any).element.getElementsByTagName("button")[0].click();
        expect(spatialCtlr.isActive).toBeFalsy();
        expect(spatialCtlr.currentGeometry).toBe(SpatialFilterControl.defaultSpatialFilterGeometry);
    });

    test("abort drawing with esc key stroke", () => {
        // const targetElement: HTMLDivElement = document.createElement("div");
        // const map: Map = new Map({
        //     target: targetElement
        // });
        // const spatialFilter: SpatialFilterControl = new SpatialFilterControl(map, {}, {});

        // Activate
        (spatialCtlr as any).element.getElementsByTagName("button")[0].click();

        map.getViewport().dispatchEvent(new KeyboardEvent("keydown", {
            key: "Escape"
        }));

        expect(spatialCtlr.isActive).toBeFalsy();
        expect((spatialCtlr as any).element.getElementsByTagName("button")[0].querySelector("i").className).toBe("bi bi-funnel");
    });
});
