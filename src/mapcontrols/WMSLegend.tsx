import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { config } from "@grafana/runtime";
// import { BusEventBase } from "@grafana/data";
import Control from "ol/control/Control";
// import BaseLayer from "ol/layer/Base";
// import LayerGroup from "ol/layer/Group";
// import { ImageWMS } from "ol/source";
import * as olCss from "ol/css";
// import { ScrollContainer } from "@grafana/ui";
// import { Scrollbars } from 'react-custom-scrollbars-2';
// import ReactDOM from 'react-dom';
// import React from "react";
import { Map } from "ol";
import { controlStyles } from "./controlStyles";
// import { createRoot, Root } from "react-dom/client";

// class PanelOptionsChangedEvent extends BusEventBase {
//     static type = 'panels-options-changed';
//   }

export type LegendItem = {
  label: string,
  url: string,
  id?: string
}

export class WMSLegend extends Control {
    static CONTROL_NAME =  "WMSLegend";

    // private baseLayer: BaseLayer;
    private legendOpened = false;
    // private props: any;
    private legendContainer: HTMLDivElement;
    // private propsHaveChanged: boolean = true;
    // private legendContainerCache: HTMLDivElement;
    private legendURLs: LegendItem[];
    private theme: GrafanaTheme2;
    // private root: Root;

    static removeWMSLegendControlFromMap(map: Map) {
        for(let i = 0; i < map.getControls().getLength(); ++i) {
            try {
              if ((map.getControls().getArray()[i] as WMSLegend).getControlName() === WMSLegend.CONTROL_NAME) {
                map.getControls().removeAt(i);
                break;
              }
            } catch (error) {
              continue;
            }
        }
    }

    // TODO: add unit tests
    static getWMSLegendControlFromMap(map: Map): WMSLegend | undefined {
        for(let i = 0; i < map.getControls().getLength(); ++i) {
            try {
              if ((map.getControls().getArray()[i] as WMSLegend).getControlName() === WMSLegend.CONTROL_NAME) {
                return map.getControls().getArray()[i] as WMSLegend;
              }
            } catch (error) {
              continue;
            }
        }
        return undefined;
    }

    constructor(legendURLs: LegendItem[], /*baseLayer: BaseLayer, props: any,*/ opt_options?: any) {
        const options = opt_options || {};

        const styles = controlStyles();

        const button = document.createElement('button');
        button.className = `${styles.border}`;
        // button.innerHTML = '>';
        // button.ariaLabel = "wms legend collapse button";
        button.setAttribute("aria-label", "wms legend collapse button");
        button.title = options.tooltipTitle || "WMS layer legend";
        const icon = document.createElement('i');
        icon.className = "bi bi-list-task";
        icon.style.cursor = "pointer";
        button.appendChild(icon);
        button.style.cursor= "pointer";
        
        const legendContainer = document.createElement("div");
        legendContainer.style.display = "block";
        legendContainer.setAttribute("aria-label", "wms legend container");
        legendContainer.style.height = "50%";
        legendContainer.style.width = "40%";
        legendContainer.style.padding = "5px 5px 5px 5px";
        legendContainer.style.position = "absolute";
        legendContainer.style.overflow = "hidden";
        legendContainer.style.resize = "both";
        legendContainer.style.minHeight = "100px";
        legendContainer.style.minWidth = "100px";
        legendContainer.style.position = "fixed";
        legendContainer.style.borderRadius = "4px";

        const element = document.createElement('div');
        element.className = `ol-zoom ol-touch ${olCss.CLASS_UNSELECTABLE}`; // ${olCss.CLASS_CONTROL} 
        element.style.zIndex = "500";
        element.style.pointerEvents = "auto";
        element.classList.add(controlStyles().mapControl);

        element.appendChild(button);

        super({
            element: element,
            target: options.target,
        });

        this.theme = config.theme2;
        // element.style.backgroundColor = this.theme.colors.background.primary; // "rgba(255,255,255, 0.4)";
        legendContainer.style.backgroundColor = this.theme.colors.background.primary;

        this.legendContainer = legendContainer;
        // this.root = createRoot(legendContainer);

        this.legendURLs = legendURLs;

        let eventHandler = () => {
            if (this.legendOpened) {
                // button.innerHTML = ">";
                // this.legendContainer.className = styles.basemapLegend_hidden;
                // button.getElementsByTagName('i')[0].setAttribute("class", "bi bi-list-task");
                button.innerHTML = "";
                const icon = document.createElement('i');
                icon.className = "bi bi-list-task";
                button.appendChild(icon);

                this.element.style.width = "";
                this.element.style.height = "";
                this.element.style.overflow = "";
                this.element.style.resize = "";
                this.element.style.paddingBottom = "";
                // this.element.style.position = "";
                // this.element.style.minHeight = "";
                // this.element.style.minWidth = "";
                // this.element.style.background = config.theme2.colors.background.primary; // "rgba(255,255,255, 0.4)";

                // this.legendContainer.style.position = "";
                
                // this.root.unmount();
                this.element.removeChild(this.legendContainer);
            } else {
                button.getElementsByTagName('i')[0].remove();
                button.innerHTML = "‹";
                
                if(this.legendContainer.getElementsByTagName("div").length === 0) {
                    this.legendContainer.appendChild(this.buildLegend(this.legendURLs));
                }

                this.element.appendChild(this.legendContainer);
            }

            // Update legend state
            this.legendOpened = !this.legendOpened;
        };

        button.addEventListener("click", () => {
            eventHandler();
        });

    }

    getControlName(): string {
        return WMSLegend.CONTROL_NAME;
    }

    isLegendOpened(): boolean {
        return this.legendOpened;
    }

    getElement(): HTMLElement {
        return this.element;
    }

    // TODO: add unit tests
    addLegendItem(item: LegendItem) {
        this.legendURLs.push(item);
    }

    // TODO: add unit tests
    addLegendItems(items: LegendItem[]) {
        this.legendURLs = this.legendURLs.concat(items);
    }

    // TODO: add unit tests
    clearLegendItems() {
        this.legendURLs = [];
    }

    // TODO: add unit tests
    removeLegendItemsByLayerIdentifier() {

    }

    buildLegend(legendURLs: LegendItem[]): HTMLDivElement {
        // let legendItems: HTMLDivElement[] = [];
        let index = 0;
        const legendDivElement = document.createElement("div");
        legendDivElement.style.overflowY = "scroll";
        legendDivElement.style.height = "100%";
        legendDivElement.style.scrollbarWidth = "thin";

        for (let l of legendURLs) {
            let imageContainer = document.createElement("div");
            imageContainer.style.display = "block";
            imageContainer.ariaLabel = `wms legend image container ${index}`;
            imageContainer.style.borderBottom = `${this.theme.colors.border.strong} 1px solid`;
            imageContainer.style.paddingBottom = "4px";
            imageContainer.style.display = "block";
            imageContainer.style.marginRight = "12px";
            imageContainer.style.marginBottom = index === legendURLs.length - 1 ? "12px" : "auto";

            let image = document.createElement("img");
            image.id = l.url;
            image.src = l.url;
            image.className = getStyles(this.theme).legendImg;

            let label = document.createElement("label");
            label.innerText = l.label;
            label.htmlFor = l.url;
            label.style.display = "block";
            label.style.color = this.theme.colors.text.maxContrast;

            imageContainer.appendChild(label);
            imageContainer.appendChild(image);

            legendDivElement.appendChild(imageContainer);

            ++index;
            }

        return legendDivElement;
    }

}

const getStyles = (theme: GrafanaTheme2) => {
    return {
    legendImg: css({
        // borderBottom: `${theme.colors.border.strong} 1px solid`,
        // paddingBottom: "4px"
        width: "100%",
        // maxWidth: "100%", // https://www.w3schools.com/css/css_rwd_images.asp
        height: "auto"
    }),
    basemapLegend_hidden: css`
        display: hidden;
    `,
    basemapLegend_visible: css`
        display: block;
        width: 50%;
        height: 100%;
    `,
    divider: css`
    border-top: 1px solid rgba(204, 204, 220, 0.12);
    `,
    legendBackground: css({
        background: theme.colors.background.primary,
      }),
    grafanaDivider: css({
        borderTop: `${theme.colors.border.strong} 1px solid`,
        marginTop: "4px",
        marginBottom: "0px",
      }),
    }
};
