import { EventBusSrv } from "@grafana/data";

export const lastGeomapPanelInstance = {
  map: {}
};

export class GeomapPanel {
  public mapControlEventBus = new EventBusSrv();
  
  constructor(props: any){

  }
}
