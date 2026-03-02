import { BusEventBase } from "@grafana/data";
import { GeomapPanel } from "GeomapPanel";

export interface CollapsibleControl {
    containerElement: HTMLDivElement;
    controlButton: HTMLButtonElement;
    controlIcon: HTMLElement;
    collapseHTMLElement: HTMLElement;
    customMapOverlayTarget: HTMLElement;
    isCollapsed: boolean;
    controlButtonContainer: HTMLDivElement;
    panelInstance: GeomapPanel;
    eventBusSrvSubscription: any;
    dispatchCollapseEvent(): void;
    handleCollapseEvent(event: BusEventBase): void;
}
