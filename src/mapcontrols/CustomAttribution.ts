import Attribution, { Options } from "ol/control/Attribution";
import { mapControlStyles } from "./mapControlStyles";
import { CustomizableControl } from "./CustomizableControl";
import { css } from "@emotion/css";
// import { Map } from "ol";

 export interface CustomAttributionOptions extends Options {
        target: HTMLElement,
        // map: Map
    }

export class CustomAttribution extends Attribution implements CustomizableControl {
    protected containerElement: HTMLDivElement;
    protected controlButton: HTMLButtonElement;
    protected controlIcon: HTMLElement;
    protected collapseHTMLElement: HTMLElement;
    protected customMapOverlayTarget: HTMLElement;
    protected isCollapsed = true;
    protected controlButtonContainer: HTMLDivElement;

    constructor(options: CustomAttributionOptions) {
        // options = options ? options : {};

        const icon = document.createElement("i");
        icon.classList.add('bi', 'bi-info-circle');
        icon.style.cursor = "pointer";

        const collapseLabel = document.createElement("span");
        collapseLabel.style.margin = "auto";
        collapseLabel.innerText = "›";
        
        super({
            ...options,
            target: undefined,
        });

        // this.element.classList.add(mapControlStyles.mapControl);
        // this.element.classList.add(styles.attributionStyle);
        // this.element.style.marginLeft = "auto";
        this.element.style.maxWidth = "300px";
        this.element.classList.add('ol-attribution', styles.attributionBorder, styles.attributionStyle);

        this.customMapOverlayTarget = options.target;

        this.setCollapsed(false);

        // Remove any buttons
        this.element.querySelectorAll("button").forEach((btn) => {
            btn.remove();
        });

        // Overlay for map
        this.containerElement = document.createElement("div");
        this.containerElement.style.position = "fixed";
        // this.containerElement.style.width = "100%";
        // this.containerElement.style.height = "100%";
        this.containerElement.style.zIndex = "1000";
        // this.containerElement.style.display = "flex";
        // this.containerElement.style.flexDirection = "column-reverse";
        this.containerElement.style.bottom = "8px";
        
        const textContainerElement = document.createElement("div");
        // textContainerElement.style.float = "right";
        textContainerElement.style.position = "absolute";
        textContainerElement.style.bottom = "4px";
        textContainerElement.style.right = "0";
        // textContainerElement.style.bottom = "8px";
        // textContainerElement.style.translate = "-15px";
        textContainerElement.classList.add(mapControlStyles.border);

        this.containerElement.appendChild(textContainerElement);

        // options.map.getTargetElement().appendChild(this.containerElement);

        // this.setTarget(this.containerElement); // add new target
        this.setTarget(textContainerElement); // add new target

        this.controlIcon = icon;

        this.collapseHTMLElement = collapseLabel;

        // Button
        this.controlButton = document.createElement("button");
        this.controlButton.appendChild(this.controlIcon);
        this.controlButton.classList.add(mapControlStyles.border);
        this.controlButton.title = "Attribution";

        this.controlButton.addEventListener("click", () => {
            if (this.isCollapsed) { // overview map is collapsed and will be opened now
                this.controlButton.removeChild(this.controlIcon);
                this.controlButton.appendChild(this.collapseHTMLElement);
                this.isCollapsed = false;

                this.customMapOverlayTarget.appendChild(this.containerElement);
            } else {
                this.controlButton.removeChild(this.collapseHTMLElement);
                this.controlButton.appendChild(this.controlIcon);
                this.isCollapsed = true;

                this.customMapOverlayTarget.removeChild(this.containerElement);
            }
        });

        this.controlButtonContainer = document.createElement("div");
        this.controlButtonContainer.appendChild(this.controlButton);
        this.controlButtonContainer.style.zIndex = "500";
        this.controlButtonContainer.style.pointerEvents = "auto";
        this.controlButtonContainer.classList.add(mapControlStyles.mapControl);

        this.customMapOverlayTarget.appendChild(this.controlButtonContainer);
    }

    protected disposeInternal(): void {
        super.disposeInternal();
        this.containerElement.remove();
        this.controlButtonContainer.remove();
    }

    removeCssClassFromElement(classToRemove: string) {
        this.element.classList.remove(classToRemove);
    }

    addCssClassToElement(classToAdd: string) {
        this.element.classList.add(classToAdd);
    }
}

const styles = {
    attributionStyle: css`
    border-radius: 2px;
    direction: rtl;
    overflow: auto;
    scrollbar-width: thin;
    padding: 8px;
    align-items: start;
    ul {
        margin: 0;
    }
    /*height: 25px;*/
    max-width: 300px;
    min-height: 25px;
    max-height: 40px;
    /*button {
        border-radius: 4px;
        border-width: 1px;
    };*/
    `,
    attributionBorder: css`
    border-radius: 4px;
    border-width: 1px;
    `
};
