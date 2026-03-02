import LayerSwitcher, { Options } from "ol-layerswitcher";
import { CustomizableControl } from "./CustomizableControl";
import { CollapsibleControl } from "./CollapsibleControl";
import { BusEventBase } from "@grafana/data";
import { GeomapPanel } from "GeomapPanel";
import { AbstractCollapsibleControl } from "./AbstractCollapsibleControl";

interface CustomOptions extends Options {
  target: HTMLElement
  className: string
}

export class CustomLayerSwitcher extends LayerSwitcher implements CustomizableControl, CollapsibleControl {
    protected containerElement: HTMLDivElement;
    protected controlButton: HTMLButtonElement;
    protected controlIcon: HTMLElement;
    protected collapseHTMLElement: HTMLElement;
    protected customMapOverlayTarget: HTMLElement;
    protected isCollapsed = true;
    protected controlButtonContainer: HTMLDivElement;
    public eventBusSrvSubscription: any;
    public panelInstance: GeomapPanel;

    constructor(opts: CustomOptions, panelInstance: GeomapPanel) {
      super({
        ...opts,
        target: undefined
      });
      this.element.style.pointerEvents = "auto";
      this.element.classList.add(opts.className);
      
      this.panelInstance = panelInstance;

      // Remove any buttons
      this.element.querySelectorAll("button").forEach((btn) => {
          btn.remove();
      });



    }

  dispatchCollapseEvent(): void {
    throw new Error("Method not implemented.");
  }
  handleCollapseEvent(event: BusEventBase): void {
    throw new Error("Method not implemented.");
  }

    removeCssClassFromElement(classToRemove: string) {
        this.element.classList.remove(classToRemove);
    }

    addCssClassToElement(classToAdd: string) {
        this.element.classList.add(classToAdd);
    }
}
