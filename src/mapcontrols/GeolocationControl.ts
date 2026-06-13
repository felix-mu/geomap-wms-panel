import Control, { Options } from "ol/control/Control";
import { mapControlStyles } from "./mapControlStyles";
import * as olCss from "ol/css";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";

import geolocationIcon from "../styles/icons/geolocation.svg";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export const GEOLOCAION_TEST_ID = "data-testid geolocation-button";

export function createGeoLocationLayer(latitude: number, longitude: number): VectorLayer {
    const iconStyle = new Style({
        image: new Icon({
            src: `${geolocationIcon}`,
            anchor: [0.5, 1],
            anchorOrigin: "bottom-left",
            anchorXUnits: "fraction",
            anchorYUnits: "fraction"
        }),
    });

    const vectorSource = new VectorSource({
        features: [
            new Feature(
                new Point(
                    [longitude, latitude]
                )
            )
        ]
    });
    
    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: iconStyle
    });

    return vectorLayer;
}

export class GeolocationControl extends Control {
    private isInitialized = false;

    constructor(opt_options: Options) {
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

        super({
            element: element,
            target: options.target,
        });

        button.addEventListener("click", this.geoLocationButtonClickEventHandler)
    }

    public geoLocationButtonClickEventHandler(evt: Event) {
        if (!this.isInitialized) {
            // Create map layer and initialize geolocation service from device
            if (!("geolocation" in navigator)) {
                /* geolocation is not available */
                return;
            }
            
            navigator.geolocation.getCurrentPosition((position) => {
                // doSomething(position.coords.latitude, position.coords.longitude);
                if (this.getMap()) {

                }
            });

            return;
        }

        // Re-center the map extent to current device location
        // TODO
    }

}
