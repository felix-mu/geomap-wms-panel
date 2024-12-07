import "bootstrap-icons/font/bootstrap-icons.css";
// import { BusEventBase } from "@grafana/data";
import Control from "ol/control/Control";
// import BaseLayer from "ol/layer/Base";
// import LayerGroup from "ol/layer/Group";
// import { ImageWMS } from "ol/source";
import * as olCss from "ol/css";
import { createEmpty, extend } from "ol/extent";
import { isEqual } from "lodash";
import VectorLayer from "ol/layer/Vector";
import { Vector } from "ol/source";

export const DATA_EXTENT_ZOOM_TEST_ID = "data-testid dataextentzoom-button";

// class PanelOptionsChangedEvent extends BusEventBase {
//     static type = 'panels-options-changed';
//   }

export class DataExtentZoom extends Control {
    static CONTROL_NAME =  "DataExtentZoom";

    constructor(opt_options?: any) {
        const options = opt_options || {};

        const button = document.createElement('button');
        // button.ariaLabel = "wms legend collapse button";
        button.setAttribute("data-testid", DATA_EXTENT_ZOOM_TEST_ID);
        button.title = options.tooltipTitle || "Zoom to data extent";
        const icon = document.createElement('i');
        icon.className = "bi bi-bounding-box-circles";
        // icon.className = "bi bi-aspect-ratio";
        // icon.className = "bi bi-arrows-fullscreen";
        button.appendChild(icon);

        const element = document.createElement('div');
        // element.className = `ol-zoom ol-touch ${olCss.CLASS_UNSELECTABLE}`;
        element.className = `${olCss.CLASS_CONTROL} ol-zoom ol-touch ${olCss.CLASS_UNSELECTABLE}`;
        element.style.top = "80%";

        element.appendChild(button);

        super({
            element: element,
            target: options.target,
        });

        const eventHandler = () => {
            let extent = createEmpty();
            // If layer is group layer extract the layers => see markersLayer.tsx line 324 where the markers layer is returned as Group
            // const layers = this.map.getLayers().getArray();
            const layers = this.getMap()?.getAllLayers();
            if (!layers) {
                return;
            }
            for (let layer of layers) {
              if (layer instanceof VectorLayer) {
                let source = layer.getSource();
                if (source !== undefined && source instanceof Vector) {
                  let features = source.getFeatures();
                  for (let feature of features) {
                    let geo = feature.getGeometry();
                    if (geo) {
                      extend(extent, geo.getExtent());
                    }
                  }
                }
              }
            }
            if (!isEqual(extent, createEmpty())) {
                this.getMap()?.getView().fit(extent);
              let zoom = this.getMap()?.getView().getZoom();
              if (zoom) {
                this.getMap()?.getView().setZoom(zoom - 0.5);
              }
            }
        };

        button.addEventListener("click", () => {
            eventHandler();
        });

    }
}
