import { css } from "@emotion/css";
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
    private legendURLs: string[];

    constructor(legendURLs: string[], /*baseLayer: BaseLayer, props: any,*/ opt_options?: any) {
        const options = opt_options || {};

        const button = document.createElement('button');
        button.innerHTML = '>>';
        
        const legendContainer = document.createElement("div");
        legendContainer.className = styles.basemapLegend_hidden;

        const element = document.createElement('div');
        // element.className = 'rotate-north ol-unselectable ol-control';
        element.className = `ol-zoom ol-touch ${olCss.CLASS_UNSELECTABLE} ${olCss.CLASS_CONTROL}`;
        element.style.top = "60%";
        element.style.width = "30%";
        element.style.height = "30%";
        element.style.overflow = "scroll";
        element.appendChild(button);
        element.appendChild(legendContainer);

        super({
        element: element,
        target: options.target,
        });

        this.legendContainer = legendContainer;

        this.legendURLs = legendURLs;

        let eventHandler = () => {
            if (this.legendOpened) {
                button.innerHTML = ">>";
                this.legendContainer.className = styles.basemapLegend_hidden;
            } else {
                button.innerHTML = "<<";
                this.legendContainer.className = styles.basemapLegend_visible;
                
                if(this.legendContainer.getElementsByTagName("div").length == 0) {
                    this.legendContainer.append(...this.buildLegend(this.legendURLs));
                }
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
    buildLegend(legendURLs: string[]): HTMLDivElement[] {
        let legendItems: HTMLDivElement[] = [];
        for (let l of legendURLs) {
            // let imageContainer = document.createElement("div");
            let image = document.createElement("img");
            image.src = l;
            image.className = styles.legendImage;

            // imageContainer.appendChild(image);

            legendItems.push(
                // imageContainer
                image
            );

            }
        return legendItems;
    }
}

const styles = {
    basemapLegend_hidden: css`
        display: hidden;
    `,
    basemapLegend_visible: css`
        display: block;
        width: 100%;
        height: 100%;
    `,
    legendImage: css`
        width: 100%;
        height: auto;
        display: block;
    `,
}