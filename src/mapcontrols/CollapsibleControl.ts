import { BusEventBase } from "@grafana/data";
import { GeomapPanel } from "GeomapPanel";

export interface CollapsibleControl {
    panelInstance: GeomapPanel;
    eventBusSrvSubscription: any;
    dispatchCollapseEvent(): void;
    handleCollapseEvent(event: BusEventBase): void;
}
