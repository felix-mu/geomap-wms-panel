import { BusEventWithPayload } from "@grafana/data";
import { GeomapPanel } from "GeomapPanel";
import Control from "ol/control/Control";

// export class CollapsibleOpenedEvent extends Event {
//     public static COLLAPSE_EVENT = "geomap-wms-panel-map-control-collapse";

//     protected evtSource: Control;

//     constructor(evtSource: Control, eventInitDict?: EventInit | undefined) {
//         super(CollapsibleOpenedEvent.COLLAPSE_EVENT, eventInitDict);
//         this.evtSource = evtSource;
//     }

//     public getEventSource(): Control {
//         return this.evtSource;
//     }
// }

export type CollapsibleMapControlOpenedEventPayload = {
    panelOrigin: GeomapPanel;
    controlOrigin: Control;
}

export class CollapsibleMapControlOpenedEvent extends BusEventWithPayload<CollapsibleMapControlOpenedEventPayload> {
  static type = "geomap-wms-panel-map-control-collapse";
}
