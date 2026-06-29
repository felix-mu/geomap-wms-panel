import Control, { Options } from "ol/control/Control";
import { mapControlStyles } from "./mapControlStyles";
import * as olCss from "ol/css";
import { Feature } from "ol";
import { Circle, Point } from "ol/geom";
import { Fill, Icon, Stroke, Style } from "ol/style";
import { fromLonLat } from 'ol/proj';

import geolocationIcon from "styles/icons/geolocation.svg";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export const GEOLOCAION_TEST_ID = "data-testid geolocation-button";

interface GeolocationControlOptions extends Options {
    // refreshInterval: number
}

export class GeolocationControl extends Control {
    private isInitialized = false;
    private geolocationFeature?: Feature;
    private geolocationFeatureAccuracy?: Feature;
    private watchId?: number

    constructor(opt_options: GeolocationControlOptions) {
        const options = opt_options || {};

        const button = document.createElement('button');
        button.className = `${mapControlStyles.border}`;
        // button.ariaLabel = "wms legend collapse button";
        button.setAttribute("data-testid", GEOLOCAION_TEST_ID);
        button.title = "Current device location";
        const icon = document.createElement('i');
        icon.style.cursor = "pointer";
        icon.className = "bi bi-geo-alt";
        // icon.className = "bi bi-aspect-ratio";
        // icon.className = "bi bi-arrows-fullscreen";
        button.appendChild(icon);
        // button.style.pointerEvents = "auto";
        button.style.cursor = "pointer";

        const element = document.createElement('div');
        // element.className = `ol-zoom ol-touch ${olCss.CLASS_UNSELECTABLE}`;
        element.className = `ol-zoom ol-touch ${olCss.CLASS_UNSELECTABLE}`; // ${olCss.CLASS_CONTROL} 
        // element.style.bottom = "20%";
        // element.style.top = "unset";
        element.style.pointerEvents = "auto";
        element.classList.add(mapControlStyles.mapControl);

        element.appendChild(button);

        super({
            element: element,
            target: options.target,
        });

        // this.refreshInterval = options.refreshInterval;

        button.addEventListener("click", (evt: Event) => {
            this.geoLocationButtonClickEventHandler()
        });
    }

    public geoLocationButtonClickEventHandler() {
        // Create map layer and initialize geolocation service from device
        if (!("geolocation" in navigator)) {
            /* geolocation is not available */
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            // doSomething(position.coords.latitude, position.coords.longitude);
            if (!this.getMap()) {
                return;
            }

            if (!this.isInitialized) {
                this.isInitialized = true;

                const { geolocationLayer, geolocationFeature, geolocationFeatureAccuracy } =
                    GeolocationControl.createGeolocationLayer(
                        position.coords.longitude, position.coords.latitude, position.coords.accuracy);

                // Save reference to feature for updates
                this.geolocationFeature = geolocationFeature;
                this.geolocationFeatureAccuracy = geolocationFeatureAccuracy;

                this.getMap()?.addLayer(geolocationLayer);
            } else {
                if (!this.geolocationFeature) {
                    return;
                }

                this.geolocationFeature.setGeometry(
                    new Point(
                        // Project to default CRS of openlayers: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.fromLonLat
                        fromLonLat([position.coords.longitude, position.coords.latitude])
                    )
                );

                if(this.geolocationFeatureAccuracy && position.coords.accuracy) {
                    this.geolocationFeatureAccuracy.setGeometry(
                        new Circle(
                            // Project to default CRS of openlayers: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.fromLonLat
                            fromLonLat([position.coords.longitude, position.coords.latitude]),
                            position.coords.accuracy
                        )
                    );
                }
            }

            this.setMapCenterFromGeolocation();

            if (this.watchId) {
                navigator.geolocation.clearWatch(this.watchId);
            }

            this.watchId = navigator.geolocation.watchPosition((position) => {
                if (!this.geolocationFeature) {
                    return;
                }

                this.geolocationFeature.setGeometry(
                    new Point(
                        // Project to default CRS of openlayers: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.fromLonLat
                        fromLonLat([position.coords.longitude, position.coords.latitude])
                    )
                );

                if(this.geolocationFeatureAccuracy && position.coords.accuracy) {
                    this.geolocationFeatureAccuracy.setGeometry(
                        new Circle(
                            // Project to default CRS of openlayers: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.fromLonLat
                            fromLonLat([position.coords.longitude, position.coords.latitude]),
                            position.coords.accuracy
                        )
                    );
                }

                this.setMapCenterFromGeolocation();
            });

        });
    }

    private setMapCenterFromGeolocation() {
        const view = this.getMap()?.getView();

        if (view) {
            view.setCenter(
                // Set geolocation or if undefined leave it the current view center
                (this.geolocationFeature?.getGeometry() as Point)?.getCoordinates() ?? view.getCenter()
            );
        }
    }

    public static createGeolocationLayer(longitude: number, latitude: number, accuracy?: number) {
        const iconStyle = styles.iconStyle;

        const gF: Feature = new Feature(
            new Point(
                // Project to default CRS of openlayers: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.fromLonLat
                fromLonLat([longitude, latitude])
            )
        )

        const gfA = accuracy ? new Feature(
            new Circle(
                // Project to default CRS of openlayers: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.fromLonLat
                fromLonLat([longitude, latitude]),
                accuracy
            )
        ) : undefined;

        const vectorSource = new VectorSource({
            features: [
                gF
            ]
        });

        if (gfA) {
            gfA.setStyle(styles["circleStyle"]);
            vectorSource.addFeature(gfA);
        }

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: iconStyle,
            properties: {
                "name": "geolocation-layer"
            }
        });

        return { geolocationLayer: vectorLayer, geolocationFeature: gF, geolocationFeatureAccuracy: gfA };
    }

}

const styles = {
    "iconStyle": new Style({
            image: new Icon({
                src: `${geolocationIcon}`,
                anchor: [0.5, 1],
                anchorOrigin: "top-left",
                anchorXUnits: "fraction",
                anchorYUnits: "fraction"
            }),
        }),
    "circleStyle": new Style(
                {
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.5)',
                    }),
                    stroke: new Stroke({
                        color: 'rgba(255, 0, 0, 0.5)',
                        width: 1
                    })
                }
            ),
}
