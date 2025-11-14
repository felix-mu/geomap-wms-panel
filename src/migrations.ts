import { FieldConfigSource, PanelModel, PanelTypeChangedHandler, Threshold, ThresholdsMode } from '@grafana/data';
import { GeomapPanelOptions } from './types';
import { MapCenterID } from './view';
import { major } from 'semver';
import { wms, WMSBaselayerConfig } from 'layers/basemaps/wms';

/**
 * This is called when the panel changes from another panel
 */
export const mapPanelChangedHandler: PanelTypeChangedHandler = (panel, prevPluginId, prevOptions, prevFieldConfig) => {
  // Changing from angular/worldmap panel to react/openlayers
  if (prevPluginId === 'grafana-worldmap-panel' && prevOptions.angular) {
    const { fieldConfig, options } = worldmapToGeomapOptions({
      ...prevOptions.angular,
      fieldConfig: prevFieldConfig,
    });
    panel.fieldConfig = fieldConfig; // Mutates the incoming panel
    return options;
  }

  return {};
};

export function worldmapToGeomapOptions(angular: any): { fieldConfig: FieldConfigSource; options: GeomapPanelOptions } {
  const fieldConfig: FieldConfigSource = {
    defaults: {},
    overrides: [],
  };

  const options: GeomapPanelOptions = {
    view: {
      id: MapCenterID.Zero,
    },
    controls: {
      showZoom: true,
      mouseWheelZoom: Boolean(angular.mouseWheelZoom),
    },
    basemap: {
      type: 'default', // was carto
    },
    layers: [
      // TODO? depends on current configs
    ],
  };

  let v = asNumber(angular.decimals);
  if (v) {
    fieldConfig.defaults.decimals = v;
  }

  // Convert thresholds and color values
  if (angular.thresholds && angular.colors) {
    const levels = angular.thresholds.split(',').map((strVale: string) => {
      return Number(strVale.trim());
    });

    // One more color than threshold
    const thresholds: Threshold[] = [];
    for (const color of angular.colors) {
      const idx = thresholds.length - 1;
      if (idx >= 0) {
        thresholds.push({ value: levels[idx], color });
      } else {
        thresholds.push({ value: -Infinity, color });
      }
    }

    fieldConfig.defaults.thresholds = {
      mode: ThresholdsMode.Absolute,
      steps: thresholds,
    };
  }

  v = asNumber(angular.initialZoom);
  if (v) {
    options.view.zoom = v;
  }

  // mapCenter: 'Europe',
  // mapCenterLatitude: 46,
  // mapCenterLongitude: 14,
  //
  // Map center (from worldmap)
  const mapCenters: any = {
    '(0°, 0°)': MapCenterID.Zero,
    'North America': 'north-america',
    Europe: 'europe',
    'West Asia': 'west-asia',
    'SE Asia': 'se-asia',
    'Last GeoHash': MapCenterID.Coordinates, // MapCenterID.LastPoint,
  };
  options.view.id = mapCenters[angular.mapCenter as any];
  options.view.lat = asNumber(angular.mapCenterLatitude);
  options.view.lon = asNumber(angular.mapCenterLongitude);
  return { fieldConfig, options };
}

function asNumber(v: any): number | undefined {
  const num = +v;
  return isNaN(num) ? undefined : num;
}

// Migrations between different panel versions (https://grafana.com/developers/plugin-tools/how-to-guides/panel-plugins/migration-handler-for-panels)
export interface WMSConfigV1 {
  wms: {
    url: string;
    layers: string[];
  },
  attribution: string
}

// This is used by DefinePlugin (https://stackoverflow.com/questions/66753073/webpack-defineplugin-not-replacing-text-in-output)
declare const PLUGIN_VERSION: string;
// const CURRENT_PLUGIN_VERSION = PLUGIN_VERSION;  // This is replaced with the current plugin version at build time
const CURRENT_PLUGIN_VERSION = PLUGIN_VERSION;
export function migrationHandler(panel: PanelModel<GeomapPanelOptions>) {
  const options = Object.assign({}, panel.options);
  const pluginVersion = panel?.pluginVersion ?? '';
  let majorVersion: number | undefined = undefined;

  try {
    majorVersion = major(pluginVersion)
  } catch (error) {
    majorVersion = 1
  }

  // if (pluginVersion === '') {
  //   // Plugin version was v1.x
  //   // Needs logic to migrate v1 -> v3
  //   // options.displayMode = 'compact';
  //   // options.displayType = 'linePlot';
  // return options;
  // }
  
  // if (majorVersion == 2) {
  //   // Panel was last saved with version v2.x
  //   // Needs logic to migrate v2 -> v3
  //   // options.displayMode = 'compact';
  //   return options;
  // }

  /*
   Default behaviour for majorVersion === 1 or in case there is a non existing pluginVersion 
   which happens when the visualisation is changed from another panel to geomap panel v1.x.
   If it happens that the version is coincidentally equal to the current version after
   the visualisation is changed from another panel to geomap panel v1.x it is checked if the the config
   object contains the property 'wms: string[]' from wmsConfigV1. If not this means that either the basemap
   is not WMS (no migration required), or the current version number is correctly set from a panel of v2.x.
   NOTE: the migration handler is only called if the plugin version provided in the panel JSON definition differs from
   the current plugin version.
   */
  if (majorVersion >= major(CURRENT_PLUGIN_VERSION) || majorVersion === 1) {
    // Get basemap name from config
    const basemapType = options.basemap.type; // type is defined from layer.id -> LayerEditor.tsx type: layer.id,

    if (basemapType && basemapType === wms.id) {
      if (options.basemap.config.wms === undefined) {
        /*
        This handles the case if the major version conincidentally equals the major version of the current plugin.
        This happens if the visualisation was changed from another panel to the Geomap WMS Panel of v1.x.
        If a migration should take place it is expected that the panel options.basemap.config contains the property 'wms'
        as defined in 'WMSConfigV1'. Otherwise it is expected that either the basemap is not of type WMS (no migration needed),
        the WMS basemap is not configured which would require manual configuration anyways,
        or that the pluginVersion in deed was set from the current plugin version.
        */
        return options;
      }

      const url: string = options.basemap.config.wms.url ?? "";
      const attribution: string = options.basemap.config.attribution ?? "";
      const layers: string[] = options.basemap.config.wms.layers ?? [];

      const wmsConfigV2: WMSBaselayerConfig = {
        wmsBaselayer: [
          {
            url: url,
            attribution: attribution,
            layers: layers.map((layer) => ({
              name: layer,
              title: layer // set the title to the technical layer name by default (is only for displaying purposes)
            })),
            opacity: 1.0,
            showLegend: false
          }
        ]
      };

      options.basemap.config = wmsConfigV2;

      return options;
    } else {
      // If not of type WMS no migration is needed and the options can be returned as is
      return options;
    }
  }

  return options;
}
