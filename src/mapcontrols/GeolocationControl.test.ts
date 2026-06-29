import { Feature, Map, View } from "ol";
import { GeolocationControl } from "./GeolocationControl";
import { Circle, Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";

Object.defineProperty(navigator, 'geolocation', {
  writable: true,
  value: {
    watchPosition: (successCallback: PositionCallback, errorCallback: PositionCallback) => {
        successCallback({
            coords: {
                latitude: 48.5,
                longitude: 11.5,
                accuracy: 10,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
                toJSON: function () {
                    throw new Error("Function not implemented.");
                }
            },
            timestamp: 0,
            toJSON: function () {
                throw new Error("Function not implemented.");
            }
        })
    },
    getCurrentPosition: (successCallback: PositionCallback, errorCallback: PositionCallback) => {
        successCallback({
            coords: {
                latitude: 48.1,
                longitude: 11.1,
                accuracy: 20,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
                toJSON: function () {
                    throw new Error("Function not implemented.");
                }
            },
            timestamp: 0,
            toJSON: function () {
                throw new Error("Function not implemented.");
            }
        })
    }
  },
});

describe("geolocation button", () => {
    // Map instance
    const map = new Map({
        view: new View({
            center: [0, 0],
            zoom: 1,
        }),
        layers: [],
        target: 'map',
    });

    const targetElement = document.createElement('div');
    map.addControl(
        new GeolocationControl({target: targetElement})
    );

    test("initial button click should add layer to map with location feature and accuracy feature", async () => {
        const button = targetElement.querySelector("button");
        button!.dispatchEvent(new MouseEvent("click", {bubbles: true}));

        expect(map.getAllLayers().length).toBe(1);
        expect(map.getAllLayers()[0].get("name")).toBe("geolocation-layer");
        
        const features: Feature[] = (map.getAllLayers()[0] as VectorLayer).getSource()?.getFeatures() as Feature[]

        expect((features![0].getGeometry() as Point).getCoordinates()).toEqual(fromLonLat([11.5, 48.5]));
        expect((features![1].getGeometry() as Circle).getRadius()).toBe(10);
    });

    test("changed position should update the feature geometry", () => {
        const button = targetElement.querySelector("button");
        button!.dispatchEvent(new MouseEvent("click", {bubbles: true}));
        const coords = 
        ((map.getAllLayers()[0].getSource() as VectorSource).getFeatures()[0].getGeometry() as Point).getCoordinates();

        expect(coords).toEqual(fromLonLat([11.5, 48.5]));
        expect(map.getView().getCenter()).toEqual(fromLonLat([11.5, 48.5]));
        expect((((map.getAllLayers()[0] as VectorLayer).getSource()?.getFeatures() as Feature[])[1].getGeometry() as Circle).getRadius()).toBe(10);
    });

    test("clicking the button after initialisation should recenter the map view", () => {
        map.getView().setCenter(fromLonLat([13.5, 48.5]));

        const button = targetElement.querySelector("button");
        button!.dispatchEvent(new MouseEvent("click", {bubbles: true}));
        const coords = 
        ((map.getAllLayers()[0].getSource() as VectorSource).getFeatures()[0].getGeometry() as Point).getCoordinates();

        expect(map.getView().getCenter()).toEqual(coords);
    });
})
