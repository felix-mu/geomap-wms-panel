import OverviewMap, { Options } from "ol/control/OverviewMap";
import { CustomizableControl } from "./CustomizableControl";
// import { css } from "@emotion/react";
import { mapControlStyles } from "./mapControlStyles";
import { CollapsibleMapControlOpenedEvent } from "./controlEvents";
import { CollapsibleControl } from "./CollapsibleControl";
import { BusEventBase } from "@grafana/data";
import { GeomapPanel } from "GeomapPanel";
// import { listen } from "ol/events";

export interface CustomOverviewmapOptions extends Options {
    target: HTMLElement
}

class CustomOverviewMap extends OverviewMap implements CustomizableControl, CollapsibleControl {
    protected overviewMapContainer: HTMLDivElement;
    protected controlButton: HTMLButtonElement;
    protected overviewMapIcon: HTMLElement;
    protected collapseHTMLElement: HTMLElement;
    protected customMapOverlayTarget: HTMLElement;
    protected isCollapsed = true;
    protected mapControlButtonContainer: HTMLDivElement;
    public panelInstance: GeomapPanel;
    public eventBusSrvSubscription: any;

    constructor(options: CustomOverviewmapOptions, panelInstance: GeomapPanel) {
        const icon = document.createElement("i");
        icon.setAttribute("class", "bi bi-map");
        icon.style.cursor = "pointer";

        const collapseLabel = document.createElement("span");
        collapseLabel.style.margin = "auto";
        collapseLabel.innerText = "›";

        super({
            ...options,
            target: undefined,
            collapsible: true // always open
        });

        this.panelInstance = panelInstance;

        this.customMapOverlayTarget = options.target;

        // Remove any buttons
        this.element.querySelectorAll("button").forEach((btn) => {
            btn.remove();
        });

        // Container for map
        this.overviewMapContainer = document.createElement("div");
        this.overviewMapContainer.style.position = "fixed";
        this.overviewMapContainer.style.bottom = "8px";
        this.overviewMapContainer.style.translate = "-156px";
        this.overviewMapContainer.classList.add(mapControlStyles.border);

        this.setTarget(this.overviewMapContainer); // add new target

        this.overviewMapIcon = icon;

        this.collapseHTMLElement = collapseLabel;

        // Button
        this.controlButton = document.createElement("button");
        this.controlButton.appendChild(this.overviewMapIcon);
        this.controlButton.classList.add(mapControlStyles.border);
        this.controlButton.title = "Overviewmap";

        this.eventBusSrvSubscription = this.panelInstance.mapControlEventBus.getStream(CollapsibleMapControlOpenedEvent)
            .subscribe((evt) => this.handleCollapseEvent(evt));

        this.controlButton.addEventListener("click", () => {
            if (this.isCollapsed) { // overview map is collapsed and will be opened now
                this.controlButton.removeChild(this.overviewMapIcon);
                this.controlButton.appendChild(this.collapseHTMLElement);
                this.isCollapsed = false;

                this.customMapOverlayTarget.appendChild(this.overviewMapContainer);
                this.setCollapsed(false);

                this.dispatchCollapseEvent();
            } else {
                this.controlButton.removeChild(this.collapseHTMLElement);
                this.controlButton.appendChild(this.overviewMapIcon);
                this.isCollapsed = true;
                this.setCollapsed(true);

                this.customMapOverlayTarget.removeChild(this.overviewMapContainer);
            }
        });

        this.mapControlButtonContainer = document.createElement("div");
        this.mapControlButtonContainer.appendChild(this.controlButton);
        this.mapControlButtonContainer.style.zIndex = "500";
        this.mapControlButtonContainer.style.pointerEvents = "auto";
        this.mapControlButtonContainer.classList.add(mapControlStyles.mapControl);

        this.customMapOverlayTarget.appendChild(this.mapControlButtonContainer);
    }

    dispatchCollapseEvent(): void {
        this.panelInstance.mapControlEventBus.publish(new CollapsibleMapControlOpenedEvent({
            panelOrigin: this.panelInstance,
            controlOrigin: this
        }));
    }
    
    handleCollapseEvent(event: BusEventBase): void {
        // Do not handle event if it comes from another panel instance or the event was emitted by this control itself
        // eslint-disable-next-line
        if ((event as CollapsibleMapControlOpenedEvent).payload.panelOrigin != this.panelInstance ||
        // eslint-disable-next-line
            (event as CollapsibleMapControlOpenedEvent).payload.controlOrigin == this) {
            return;
        }

        // if it is already collapsed do nothing
        if (this.isCollapsed) {
            return;
        }

        this.controlButton.removeChild(this.collapseHTMLElement);
        this.controlButton.appendChild(this.overviewMapIcon);
        this.isCollapsed = true;

        this.customMapOverlayTarget.removeChild(this.overviewMapContainer);
    }

    public disposeInternal(): void {
        super.disposeInternal();
        this.overviewMapContainer.remove();
        this.mapControlButtonContainer.remove();
        this.eventBusSrvSubscription.unsubscribe();
    }

    public removeCssClassFromElement(classToRemove: string) {
        this.element.classList.remove(classToRemove);
    }

    public addCssClassToElement(classToAdd: string) {
        this.element.classList.add(classToAdd);
    }
}

// const styles = {
//     collapseButton: css({
//         position: "static"
//     })
//     overviewMapContainer: css({
//         right: "0.5em",
//         top: "80%",
//         border: "1px solid #7b98bc",
//         height: "15%",
//         margin: "2px",
//         width: "15%",
//     })
// };


export { CustomOverviewMap };
