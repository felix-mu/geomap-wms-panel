import Attribution, { Options } from "ol/control/Attribution";
import { mapControlStyles } from "./mapControlStyles";
import { CustomizableControl } from "./CustomizableControl";
// import { css } from "@emotion/css";

 export interface CustomAttributionOptions extends Options {
        target: HTMLElement
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

        this.customMapOverlayTarget = options.target;

        this.setCollapsed(false);

        // Remove any buttons
        this.element.querySelectorAll("button").forEach((btn) => {
            btn.remove();
        });

        // Container for map
        this.containerElement = document.createElement("div");
        this.containerElement.style.position = "fixed";
        this.containerElement.style.bottom = "8px";
        this.containerElement.style.translate = "-15px";
        this.containerElement.classList.add(mapControlStyles.border);

        this.setTarget(this.containerElement); // add new target

        this.controlIcon = icon;

        this.collapseHTMLElement = collapseLabel;

        // Button
        this.controlButton = document.createElement("button");
        this.controlButton.appendChild(this.controlIcon);
        this.controlButton.classList.add(mapControlStyles.border);

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

// const styles = {
//     attributionStyle: css`
//     border-radius: 2px;
//     /*button {
//         border-radius: 4px;
//         border-width: 1px;
//     };*/
//     `,
//     attributionBorder: css`
//     border-radius: 4px;
//     border-width: 1px;
//     `
// };
