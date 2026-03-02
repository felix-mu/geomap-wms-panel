import LayerSwitcher, { Options } from "ol-layerswitcher";
import { CustomizableControl } from "./CustomizableControl";
import { CollapsibleControl } from "./CollapsibleControl";
import { BusEventBase } from "@grafana/data";
import { GeomapPanel } from "GeomapPanel";
import { mapControlStyles } from "./mapControlStyles";
import { CollapsibleMapControlOpenedEvent } from "./controlEvents";
import { config } from "@grafana/runtime";
import { css } from "@emotion/css";

interface CustomOptions extends Options {
  target: HTMLElement
  className: string
}

export class CustomLayerSwitcher extends LayerSwitcher implements CustomizableControl, CollapsibleControl {
    public containerElement: HTMLDivElement;
    public controlButton: HTMLButtonElement;
    public controlIcon: HTMLElement;
    public collapseHTMLElement: HTMLElement;
    public customMapOverlayTarget: HTMLElement;
    public isCollapsed = true;
    public controlButtonContainer: HTMLDivElement;
    public eventBusSrvSubscription: any;
    public panelInstance: GeomapPanel;
    private theme = config.theme2;

    constructor(opts: CustomOptions, panelInstance: GeomapPanel) {
      const collapseLabel = document.createElement("span");
      collapseLabel.style.margin = "auto";
      collapseLabel.innerText = "›";

      const icon = document.createElement("i");
      icon.classList.add('bi', 'bi-layers');
      icon.style.cursor = "pointer";

      super({
        ...opts,
        target: undefined,
        startActive: true
      });

      this.customMapOverlayTarget = opts.target;

      this.element.style.pointerEvents = "auto";
      this.element.classList.add(opts.className);
      
      this.panelInstance = panelInstance;

      // Remove any buttons
      this.element.querySelectorAll("button").forEach((btn) => {
          btn.remove();
      });

      // Container for layer switcher panel container
      this.containerElement = document.createElement("div");
      this.containerElement.style.position = "fixed";
      this.containerElement.style.zIndex = "1000";
      // this.containerElement.style.height = "100%";
      // this.containerElement.style.width = "100%";
      this.containerElement.style.top = "8px";
      
      const panelContainerElement = document.createElement("div");
      panelContainerElement.style.position = "absolute";
      panelContainerElement.style.top = "0";
      panelContainerElement.style.right = "0";
      panelContainerElement.style.padding = "4px";
      panelContainerElement.classList.add(mapControlStyles.border, styles.layerPanel);
      panelContainerElement.style.backgroundColor = this.theme.colors.background.primary;

      this.containerElement.appendChild(panelContainerElement);

      this.setTarget(panelContainerElement); // add new target

      this.controlIcon = icon;

      this.collapseHTMLElement = collapseLabel;

      // Button
      this.controlButton = document.createElement("button");
      this.controlButton.appendChild(this.controlIcon);
      this.controlButton.classList.add(mapControlStyles.border);
      this.controlButton.title = "Map layers";

      this.eventBusSrvSubscription = this.panelInstance.mapControlEventBus.getStream(CollapsibleMapControlOpenedEvent)
          .subscribe((evt) => this.handleCollapseEvent(evt));

      this.controlButton.addEventListener("click", () => {
          if (this.isCollapsed) { // overview map is collapsed and will be opened now
              this.controlButton.removeChild(this.controlIcon);
              this.controlButton.appendChild(this.collapseHTMLElement);
              this.isCollapsed = false;

              // Render panel with layers
              this.renderPanel();

              this.customMapOverlayTarget.appendChild(this.containerElement);

              this.dispatchCollapseEvent();
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
      this.controlButton.appendChild(this.controlIcon);
      this.isCollapsed = true;

      this.customMapOverlayTarget.removeChild(this.containerElement);
    }

    protected disposeInternal(): void {
      super.disposeInternal();
      this.containerElement.remove();
      this.controlButtonContainer.remove();
      this.eventBusSrvSubscription.unsubscribe();
    }

    removeCssClassFromElement(classToRemove: string) {
      this.element.classList.remove(classToRemove);
    }

    addCssClassToElement(classToAdd: string) {
      this.element.classList.add(classToAdd);
    }
}

const styles = {
  layerPanel: css`
  padding: 4px;
  width: max-content;
  max-width: 300px;
  max-height: 150px;
  overflow: auto;
  scrollbar-width: thin;
  list-style-type: none;
  /*ul {
    margin: 0;
    li {
        float: left;
        input {
            float: left;
        }
    }*/
}
  `
};
