import { DrawEvent } from "ol/interaction/Draw";
import SpatialFilterControl from "./SpatialFilter";
import Map from 'ol/Map';
import Feature from 'ol/Feature.js';
import Polygon from 'ol/geom/Polygon.js';
import WKT from 'ol/format/WKT.js';

// Create SpatialFilter before tests are run
const spatialCtlr: SpatialFilterControl = new SpatialFilterControl(new Map({}), {}, {});

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
        const event = new DrawEvent("drawend", new Feature(featureGeometry));
        spatialCtlr.drawInteraction.dispatchEvent(event);
        
        expect(new WKT().writeGeometry(featureGeometry)).toBe(spatialCtlr.currentGeometry);

    });

    test("A second click deactivates the spatial filter control and sets the geometry to the default geometry", () => {
        (spatialCtlr as any).element.getElementsByTagName("button")[0].click();
        expect(spatialCtlr.isActive).toBeFalsy();
        expect(spatialCtlr.currentGeometry).toBe(SpatialFilterControl.defaultSpatialFilterGeometry);
    });
});
