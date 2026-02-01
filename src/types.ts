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
  allLayers?: boolean;
  id: string;
  lastOnly?: boolean;
  lat?: number;
  layer?: string;
  lon?: number;
  maxZoom?: number;
  minZoom?: number;
  noRepeat?: boolean;
  padding?: number;
  shared?: boolean;
  zoom?: number;
  ignoreDashboardRefresh?: boolean;
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
