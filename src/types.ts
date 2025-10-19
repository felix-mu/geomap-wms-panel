import { Units } from 'ol/control/ScaleLine';
import { MapCenterID } from './view';
import { ExtendMapLayerOptions } from 'extension';

export interface ControlsOptions {
  // Zoom (upper left)
  showZoom?: boolean;

  // let the mouse wheel zoom
  mouseWheelZoom?: boolean;

  // Lower right
  showAttribution?: boolean;

  // Scale options
  showScale?: boolean;
  scaleUnits?: Units;

  // Layer options
  showLayercontrol?: boolean;

  // Show debug
  showDebug?: boolean;

  // Custom control: spatial filter
  showSpatialFilter?: boolean

  // Custom control: data extent zoom
  showDataExtentZoom?: boolean

  // Custom control: overview map
  overviewMap?: OverviewMapConfig
}

export interface OverviewMapConfig<TConfig = any> extends ExtendMapLayerOptions {
  enabled: boolean;
}

export interface MapViewConfig {
  id: string; // placename > lookup
  lat?: number;
  lon?: number;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  shared?: boolean;
}

export const defaultView: MapViewConfig = {
  id: MapCenterID.Zero,
  lat: 0,
  lon: 0,
  zoom: 1,
};

export interface GeomapPanelOptions {
  view: MapViewConfig;
  controls: ControlsOptions;
  basemap: ExtendMapLayerOptions;
  layers: ExtendMapLayerOptions[];
}
