import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { config } from "@grafana/runtime";
import { LegendItem } from "layers/basemaps/wms";
// import { BusEventBase } from "@grafana/data";
import Control from "ol/control/Control";
// import BaseLayer from "ol/layer/Base";
// import LayerGroup from "ol/layer/Group";
// import { ImageWMS } from "ol/source";
import * as olCss from "ol/css";


// class PanelOptionsChangedEvent extends BusEventBase {
//     static type = 'panels-options-changed';
//   }

export class WMSLegend extends Control {
    // private baseLayer: BaseLayer;
    private legendOpened: boolean = false;
    // private props: any;
    private legendContainer: HTMLDivElement;
    // private propsHaveChanged: boolean = true;
    // private legendContainerCache: HTMLDivElement;
    private legendURLs: LegendItem[];
    private theme: GrafanaTheme2;

    constructor(legendURLs: LegendItem[], /*baseLayer: BaseLayer, props: any,*/ opt_options?: any) {
        const options = opt_options || {};

        const button = document.createElement('button');
        button.innerHTML = '>';
        
        const legendContainer = document.createElement("div");
        legendContainer.style.display = "block";
        // legendContainer.className = styles.basemapLegend_hidden;

        const element = document.createElement('div');
        // element.className = `ol-zoom ol-touch ${olCss.CLASS_UNSELECTABLE}`;
        element.className = `${olCss.CLASS_CONTROL} ol-zoom ol-touch ${olCss.CLASS_UNSELECTABLE}`;
        element.style.top = "60%";
        // element.style.width = "30%";
        // element.style.height = "30%";
        // element.style.overflow = "scroll";
        // element.style.resize = "both";

        element.appendChild(button);
        // element.appendChild(legendContainer);

        super({
        element: element,
        target: options.target,
        });

        this.theme = config.theme2;
        // element.style.backgroundColor = this.theme.colors.background.primary; // "rgba(255,255,255, 0.4)";
        legendContainer.style.backgroundColor = this.theme.colors.background.primary;

        this.legendContainer = legendContainer;

        this.legendURLs = legendURLs;

        let eventHandler = () => {
            if (this.legendOpened) {
                button.innerHTML = ">";
                // this.legendContainer.className = styles.basemapLegend_hidden;
                this.element.style.width = "";
                this.element.style.height = "";
                this.element.style.overflow = "";
                this.element.style.resize = "";
                // this.element.style.background = config.theme2.colors.background.primary; // "rgba(255,255,255, 0.4)";

                this.element.removeChild(this.legendContainer);
            } else {
                button.innerHTML = "<";
                // this.legendContainer.className = styles.basemapLegend_visible;

                this.element.style.overflow = "scroll";
                this.element.style.resize = "both";
                // this.element.style.background = config.theme2.colors.background.primary; //"rgba(255,255,255, 1)";
                
                if(this.legendContainer.getElementsByTagName("div").length == 0) {
                    this.legendContainer.append(...this.buildLegend(this.legendURLs));
                }

                this.element.appendChild(this.legendContainer);
                this.element.style.width = "30%";
                this.element.style.height = "30%";
            }

            // Update legend state
            this.legendOpened = !this.legendOpened;
        };

        // this.baseLayer = baseLayer;

        // this.props.eventBus.getStream(PanelOptionsChangedEvent).subscribe((_evt: any) => {
        //     this.legendContainer.replaceChildren();
        // }
        // );

        button.addEventListener("click", () => {
            eventHandler();
        });

    }

    getControlName(): string {
        return "WMSLegend";
    }

    // buildLegend(layer: BaseLayer): HTMLDivElement[] {
    //     let legendItems: HTMLDivElement[] = [];
    //     for (let l of layer.getLayersArray()) {
    //         if (l instanceof LayerGroup) {
    //             legendItems.push(...this.buildLegend(l));
    //         } else {
    //             try {
    //                 const legendURL = (l.getSource()! as ImageWMS).getLegendUrl();

    //                 if (legendURL === undefined) {
    //                     continue;
    //                 }
    //                 let imageContainer = document.createElement("div");
    //                 let image = document.createElement("img");
    //                 image.src = legendURL;
    //                 image.className = styles.legendImage;

    //                 imageContainer.appendChild(image);

    //                 legendItems.push(
    //                     imageContainer
    //                 );
    //             } catch (error) {
                    
    //             }
    //         }
    //     }
    //     return legendItems;
    // }
    buildLegend(legendURLs: LegendItem[]): HTMLDivElement[] {
        let legendItems: HTMLDivElement[] = [];
        for (let l of legendURLs) {
            let imageContainer = document.createElement("div");
            imageContainer.style.display = "block";


            let image = document.createElement("img");
            image.id = l.url;
            image.src = l.url;
            // image.className = styles.legendImage;

            let label = document.createElement("label");
            label.innerText = /*"Layer: " + */l.label;
            label.htmlFor = l.url;
            label.style.display = "block";
            label.style.color = this.theme.colors.text.maxContrast;

            let divider = document.createElement("hr");
            divider.className = getStyles(this.theme).grafanaDivider; // divider

            imageContainer.appendChild(label);
            imageContainer.appendChild(image);
            imageContainer.appendChild(divider);

            legendItems.push(
                imageContainer
                // image
            );

            }
        return legendItems;
    }

}

const getStyles = (theme: GrafanaTheme2) => {
    return {
    basemapLegend_hidden: css`
        display: hidden;
    `,
    basemapLegend_visible: css`
        display: block;
        width: 50%;
        height: 100%;
    `,
    // legendImage: css`
    //     width: 100%;
    //     height: auto;
    // `,
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