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
import { CustomScrollbar } from "@grafana/ui";
// import { Scrollbars } from 'react-custom-scrollbars-2';
import ReactDOM from 'react-dom';
import React from "react";
import { Map } from "ol";

// class PanelOptionsChangedEvent extends BusEventBase {
//     static type = 'panels-options-changed';
//   }

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

    constructor(legendURLs: LegendItem[], /*baseLayer: BaseLayer, props: any,*/ opt_options?: any) {
        const options = opt_options || {};

        const button = document.createElement('button');
        // button.innerHTML = '>';
        // button.ariaLabel = "wms legend collapse button";
        button.setAttribute("aria-label", "wms legend collapse button");
        button.title = options.tooltipTitle || "WMS layer legend";
        const icon = document.createElement('i');
        icon.className = "bi bi-list-task";
        button.appendChild(icon);
        
        const legendContainer = document.createElement("div");
        legendContainer.style.display = "block";
        legendContainer.setAttribute("aria-label", "wms legend container");
        // legendContainer.style.overflow = "scroll";
        legendContainer.style.height = "100%";
        legendContainer.style.padding = "5px 5px 5px 5px";
        // legendContainer.className = styles.basemapLegend_hidden;
        // const legendContainerRoot = createRoot(legendContainer);
        // legendContainerRoot.render(<CustomScrollbar></CustomScrollbar>);
        // ReactDOM.render(<CustomScrollbar></CustomScrollbar>, legendContainer);

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
                // this.element.style.background = config.theme2.colors.background.primary; // "rgba(255,255,255, 0.4)";

                this.element.removeChild(this.legendContainer);
            } else {
                button.getElementsByTagName('i')[0].remove();
                button.innerHTML = "‹";
                // button.getElementsByTagName('i')[0].setAttribute("class", "bi bi-chevron-left");
                // this.legendContainer.className = styles.basemapLegend_visible;

                this.element.style.overflow = "hidden"; // "scroll";
                this.element.style.resize = "both";
                this.element.style.paddingBottom = "30px";
                // this.element.style.background = config.theme2.colors.background.primary; //"rgba(255,255,255, 1)";
                
                if(this.legendContainer.getElementsByTagName("div").length === 0) {
                    // this.legendContainer.append(...this.buildLegend(this.legendURLs));
                    ReactDOM.render(this.buildLegend(this.legendURLs), legendContainer);
                }

                this.element.appendChild(this.legendContainer);
                // this.element.style.width = "30%";
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
        return WMSLegend.CONTROL_NAME;
    }

    isLegendOpened(): boolean {
        return this.legendOpened;
    }

    getElement(): HTMLElement {
        return this.element;
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

    // buildLegend(legendURLs: LegendItem[]): HTMLDivElement[] {
    //     let legendItems: HTMLDivElement[] = [];
    //     let index = 0;
    //     for (let l of legendURLs) {
    //         let imageContainer = document.createElement("div");
    //         imageContainer.style.display = "block";
    //         imageContainer.ariaLabel = `wms legend image container ${index}`;
    //         // imageContainer.setAttribute("aria-label", `wms legend image container ${index}`);

    //         let image = document.createElement("img");
    //         image.id = l.url;
    //         image.src = l.url;
    //         // image.className = styles.legendImage;

    //         let label = document.createElement("label");
    //         label.innerText = /*"Layer: " + */l.label;
    //         label.htmlFor = l.url;
    //         label.style.display = "block";
    //         label.style.color = this.theme.colors.text.maxContrast;

    //         let divider = document.createElement("hr");
    //         divider.className = getStyles(this.theme).grafanaDivider; // divider

    //         imageContainer.appendChild(label);
    //         imageContainer.appendChild(image);
    //         imageContainer.appendChild(divider);

    //         legendItems.push(
    //             imageContainer
    //             // image
    //         );

    //         ++index;

    //         }
    //     return legendItems;
    // }

    buildLegend(legendURLs: LegendItem[]): JSX.Element {
        return (
            <CustomScrollbar className={getStyles(this.theme).customScrollbar}>
                {legendURLs.length > 0 && legendURLs.map((legendItem, index) => {
                    return (
                        <div key={legendItem.url} style={{
                                borderBottom: `${this.theme.colors.border.strong} 1px solid`,
                                paddingBottom: "4px",
                                display: "block", 
                                marginRight: "12px", 
                                marginBottom: index === legendURLs.length - 1 ? "12px" : "auto"
                            }} aria-label={`wms legend image container ${index}`}>
                            <label style={{display: "block", color: this.theme.colors.text.maxContrast}}
                                htmlFor={legendItem.url}>{legendItem.label}</label>
                            <img id={legendItem.url} src={legendItem.url} className={getStyles(this.theme).legendImg}></img>
                            {/* <hr className={getStyles(this.theme).grafanaDivider}></hr> */}
                        </div>
                    );
                })
                }
            </CustomScrollbar>
        );
    }

}

const getStyles = (theme: GrafanaTheme2) => {
    return {
    legendImg: css({
        // borderBottom: `${theme.colors.border.strong} 1px solid`,
        // paddingBottom: "4px"
        // width: "100%"
        maxWidth: "100%", // https://www.w3schools.com/css/css_rwd_images.asp
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
      customScrollbar: css({
        // Fix for Firefox. For some reason sometimes .view container gets a height of its content, but in order to
        // make scroll working it should fit outer container size (scroll appears only when inner container size is
        // greater than outer one).
        display: 'flex',
        flexGrow: 1,
        '.scrollbar-view': {
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
        },
        '.track-vertical': {
          borderRadius: theme.shape.borderRadius(2),
          width: `${theme.spacing(1)} !important`,
          right: 0,
          bottom: theme.spacing(0.25),
          top: theme.spacing(0.25),
        },
        '.track-horizontal': {
          borderRadius: theme.shape.borderRadius(2),
          height: `${theme.spacing(1)} !important`,
          right: theme.spacing(0.25),
          bottom: theme.spacing(0.25),
          left: theme.spacing(0.25),
        },
        '.thumb-vertical': {
          background: theme.colors.action.focus,
          borderRadius: theme.shape.borderRadius(2),
          opacity: 0,
        },
        '.thumb-horizontal': {
          background: theme.colors.action.focus,
          borderRadius: theme.shape.borderRadius(2),
          opacity: 0,
        },
        '&:hover': {
          '.thumb-vertical, .thumb-horizontal': {
            opacity: 1,
            transition: 'opacity 0.3s ease-in-out',
          },
        },
      }),
    }
};
