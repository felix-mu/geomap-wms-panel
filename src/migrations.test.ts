import { PanelModel, FieldConfigSource } from '@grafana/data';
import { mapPanelChangedHandler, migrationHandler } from './migrations';
import { MarkersConfig } from 'layers/data/markersLayer';

describe('Worldmap Migrations', () => {
  let prevFieldConfig: FieldConfigSource;

  beforeEach(() => {
    prevFieldConfig = {
      defaults: {},
      overrides: [],
    };
  });

  it('simple worldmap', () => {
    const old: any = {
      angular: simpleWorldmapConfig,
    };
    const panel = {} as PanelModel;
    panel.options = mapPanelChangedHandler(panel, 'grafana-worldmap-panel', old, prevFieldConfig);
    expect(panel).toMatchInlineSnapshot(`
      {
        "fieldConfig": {
          "defaults": {
            "decimals": 3,
            "thresholds": {
              "mode": "absolute",
              "steps": [
                {
                  "color": "#37872D",
                  "value": -Infinity,
                },
                {
                  "color": "#E0B400",
                  "value": 0,
                },
                {
                  "color": "#C4162A",
                  "value": 50,
                },
                {
                  "color": "#8F3BB8",
                  "value": 100,
                },
              ],
            },
          },
          "overrides": [],
        },
        "options": {
          "basemap": {
            "type": "default",
          },
          "controls": {
            "mouseWheelZoom": true,
            "showZoom": true,
          },
          "layers": [],
          "view": {
            "id": "europe",
            "lat": 46,
            "lon": 14,
            "zoom": 6,
          },
        },
      }
    `);
  });
});

const simpleWorldmapConfig = {
  id: 23763571993,
  gridPos: {
    h: 8,
    w: 12,
    x: 0,
    y: 0,
  },
  type: 'grafana-worldmap-panel',
  title: 'Panel Title',
  thresholds: '0,50,100',
  maxDataPoints: 1,
  circleMaxSize: 30,
  circleMinSize: 2,
  colors: ['#37872D', '#E0B400', '#C4162A', '#8F3BB8'],
  decimals: 3,
  esMetric: 'Count',
  hideEmpty: false,
  hideZero: false,
  initialZoom: '6',
  locationData: 'countries',
  mapCenter: 'Europe',
  mapCenterLatitude: 46,
  mapCenterLongitude: 14,
  mouseWheelZoom: true,
  showLegend: true,
  stickyLabels: false,
  tableQueryOptions: {
    geohashField: 'geohash',
    latitudeField: 'latitude',
    longitudeField: 'longitude',
    metricField: 'metric',
    queryType: 'geohash',
  },
  unitPlural: '',
  unitSingle: '',
  valueName: 'total',
  datasource: null,
};

// Migration tests
const PANEL_V1_WMS_NO_CONFIG_NO_PLUGIN_VERSION = JSON.parse(`
{
  "id": 1,
  "type": "felixrelleum-geomapwms-panel",
  "title": "New panel",
  "gridPos": {
    "x": 0,
    "y": 0,
    "h": 8,
    "w": 12
  },
  "fieldConfig": {
    "defaults": {
      "mappings": [],
      "thresholds": {
        "mode": "absolute",
        "steps": [
          {
            "color": "green",
            "value": null
          },
          {
            "color": "red",
            "value": 80
          }
        ]
      },
      "color": {
        "mode": "thresholds"
      }
    },
    "overrides": []
  },
  "targets": [
    {
      "datasource": {
        "type": "grafana-testdata-datasource",
        "uid": "uid-test-data-123"
      },
      "refId": "A",
      "scenarioId": "random_walk",
      "seriesCount": 1
    }
  ],
  "datasource": {
    "type": "grafana-testdata-datasource",
    "uid": "uid-test-data-123"
  },
  "options": {
    "view": {
      "id": "zero",
      "lat": 0,
      "lon": 0,
      "zoom": 1
    },
    "basemap": {
      "type": "wms",
      "config": {}
    },
    "controls": {
      "showZoom": true,
      "mouseWheelZoom": true,
      "showAttribution": true,
      "showLayercontrol": true,
      "showScale": false,
      "showDebug": false,
      "showSpatialFilter": false
    }
  }
}
`) as PanelModel;

const PANEL_V1_WMS_WITH_CONFIG_NO_PLUGIN_VERSION = JSON.parse(`
{
  "id": 1,
  "type": "felixrelleum-geomapwms-panel",
  "title": "New panel",
  "gridPos": {
    "x": 0,
    "y": 0,
    "h": 8,
    "w": 12
  },
  "fieldConfig": {
    "defaults": {
      "mappings": [],
      "thresholds": {
        "mode": "absolute",
        "steps": [
          {
            "color": "green",
            "value": null
          },
          {
            "color": "red",
            "value": 80
          }
        ]
      },
      "color": {
        "mode": "thresholds"
      }
    },
    "overrides": []
  },
  "targets": [
    {
      "datasource": {
        "type": "grafana-testdata-datasource",
        "uid": "uid-test-data-123"
      },
      "refId": "A",
      "scenarioId": "random_walk",
      "seriesCount": 1
    }
  ],
  "datasource": {
    "type": "grafana-testdata-datasource",
    "uid": "uid-test-data-123"
  },
  "options": {
    "view": {
      "id": "zero",
      "lat": 0,
      "lon": 0,
      "zoom": 1
    },
    "basemap": {
      "type": "wms",
      "config": {
        "wms": {
          "url": " https://sgx.geodatenzentrum.de/wms_topplus_open",
          "layers": [
            "web"
          ]
        },
        "attribution": "tet"
      }
    },
    "controls": {
      "showZoom": true,
      "mouseWheelZoom": true,
      "showAttribution": true,
      "showLayercontrol": true,
      "showScale": false,
      "showDebug": false,
      "showSpatialFilter": false
    }
  }
}
`) as PanelModel;

const PANEL_V1_NO_WMS_WITH_CONFIG_WITH_PLUGIN_VERSION = JSON.parse(`
{
  "id": 1,
  "type": "felixrelleum-geomapwms-panel",
  "title": "New panel",
  "gridPos": {
    "x": 0,
    "y": 0,
    "h": 8,
    "w": 12
  },
  "fieldConfig": {
    "defaults": {
      "mappings": [],
      "thresholds": {
        "mode": "absolute",
        "steps": [
          {
            "color": "green",
            "value": null
          },
          {
            "color": "red",
            "value": 80
          }
        ]
      },
      "color": {
        "mode": "thresholds"
      }
    },
    "overrides": []
  },
  "pluginVersion": "1.0.2",
  "targets": [
    {
      "datasource": {
        "type": "grafana-testdata-datasource",
        "uid": "uid-test-data-123"
      },
      "refId": "A",
      "scenarioId": "random_walk",
      "seriesCount": 1
    }
  ],
  "datasource": {
    "type": "grafana-testdata-datasource",
    "uid": "uid-test-data-123"
  },
  "options": {
    "view": {
      "id": "zero",
      "lat": 0,
      "lon": 0,
      "zoom": 1
    },
    "basemap": {
      "type": "default",
      "config": {
        "wms": {
          "url": " https://sgx.geodatenzentrum.de/wms_topplus_open",
          "layers": [
            "web"
          ]
        },
        "attribution": "tet"
      }
    },
    "controls": {
      "showZoom": true,
      "mouseWheelZoom": true,
      "showAttribution": true,
      "showLayercontrol": true,
      "showScale": false,
      "showDebug": false,
      "showSpatialFilter": false
    }
  }
}
`) as PanelModel;

const PANEL_V1_WMS_WITH_CONFIG_WITH_PLUGIN_VERSION_2_LAYERS = JSON.parse(`
{
  "id": 1,
  "type": "felixrelleum-geomapwms-panel",
  "title": "New panel",
  "gridPos": {
    "x": 0,
    "y": 0,
    "h": 8,
    "w": 12
  },
  "fieldConfig": {
    "defaults": {
      "mappings": [],
      "thresholds": {
        "mode": "absolute",
        "steps": [
          {
            "color": "green",
            "value": null
          },
          {
            "color": "red",
            "value": 80
          }
        ]
      },
      "color": {
        "mode": "thresholds"
      }
    },
    "overrides": []
  },
  "pluginVersion": "10.0.2",
  "targets": [
    {
      "datasource": {
        "type": "grafana-testdata-datasource",
        "uid": "uid-test-data-123"
      },
      "refId": "A",
      "scenarioId": "random_walk",
      "seriesCount": 1
    }
  ],
  "datasource": {
    "type": "grafana-testdata-datasource",
    "uid": "uid-test-data-123"
  },
  "options": {
    "view": {
      "id": "zero",
      "lat": 0,
      "lon": 0,
      "zoom": 1
    },
    "basemap": {
      "type": "wms",
      "config": {
        "wms": {
          "url": " https://sgx.geodatenzentrum.de/wms_topplus_open",
          "layers": [
            "web",
            "web"
          ]
        },
        "attribution": "tet"
      }
    },
    "controls": {
      "showZoom": true,
      "mouseWheelZoom": true,
      "showAttribution": true,
      "showLayercontrol": true,
      "showScale": false,
      "showDebug": false,
      "showSpatialFilter": false
    }
  }
}
`) as PanelModel;

const PANEL_V2_WMS_WITH_CONFIG_WITH_PLUGIN_VERSION = JSON.parse(`
{
  "id": 1,
  "type": "felixrelleum-geomapwms-panel",
  "title": "New panel",
  "gridPos": {
    "x": 0,
    "y": 0,
    "h": 8,
    "w": 12
  },
  "fieldConfig": {
    "defaults": {
      "mappings": [],
      "thresholds": {
        "mode": "absolute",
        "steps": [
          {
            "color": "green",
            "value": null
          },
          {
            "color": "red",
            "value": 80
          }
        ]
      },
      "color": {
        "mode": "thresholds"
      }
    },
    "overrides": []
  },
  "pluginVersion": "2.0.1",
  "targets": [
    {
      "datasource": {
        "type": "grafana-testdata-datasource",
        "uid": "uid-test-data-123"
      },
      "refId": "A",
      "scenarioId": "random_walk",
      "seriesCount": 1
    }
  ],
  "datasource": {
    "type": "grafana-testdata-datasource",
    "uid": "uid-test-data-123"
  },
  "options": {
    "view": {
      "id": "zero",
      "lat": 0,
      "lon": 0,
      "zoom": 1
    },
    "basemap": {
      "type": "wms",
      "config": {
        "wmsBaselayer": [
          {
            "url": " https://sgx.geodatenzentrum.de/wms_topplus_open",
            "layers": [
              {
                "title": "TopPlusOpen",
                "name": "web"
              }
            ],
            "attribution": "",
            "opacity": 1,
            "showLegend": true
          }
        ]
      },
      "opacity": 1,
      "visible": true,
      "enabledForDataLinks": true
    },
    "controls": {
      "showZoom": true,
      "mouseWheelZoom": true,
      "showAttribution": true,
      "showLayercontrol": true,
      "showScale": false,
      "showDebug": false,
      "showSpatialFilter": false,
      "showDataExtentZoom": true,
      "overviewMap": {
        "enabled": false
      }
    }
  }
}
`) as PanelModel;

const PANEL_V2_WMS_WITH_CONFIG_WITH_PLUGIN_VERSION_WITH_OLD_ICONSIZE = JSON.parse(`
{
  "id": 6,
  "type": "felixrelleum-geomapwms-panel",
  "title": "Geomap WMS Panel WMTS w custom parameter",
  "gridPos": {
    "x": 0,
    "y": 40,
    "h": 9,
    "w": 12
  },
  "fieldConfig": {
    "defaults": {
      "mappings": [],
      "thresholds": {
        "mode": "absolute",
        "steps": [
          {
            "color": "green",
            "value": null
          },
          {
            "color": "#E24D42",
            "value": 1
          },
          {
            "color": "#6ED0E0",
            "value": 2
          },
          {
            "color": "#1F78C1",
            "value": 4
          },
          {
            "color": "#EF843C",
            "value": 5
          },
          {
            "color": "#BA43A9",
            "value": 7
          },
          {
            "color": "#705DA0",
            "value": 9
          },
          {
            "color": "#508642",
            "value": 11
          },
          {
            "color": "#CCA300",
            "value": 14
          }
        ]
      },
      "color": {
        "mode": "thresholds"
      },
      "links": []
    },
    "overrides": []
  },
  "pluginVersion": "2.0.1",
  "targets": [
  ],
  "datasource": {
    "type": "grafana-testdata-datasource",
    "uid": "uid-test-data-123"
  },
  "options": {
    "view": {
      "id": "auto",
      "lat": 33,
      "lon": 120,
      "zoom": 15
    },
    "basemap": {
      "type": "wmts",
      "config": {
        "wmsBaselayer": [
          {
            "attribution": "",
            "id": "f8fb929f-c93e-4c5d-9aa9-848e9476f575",
            "layers": [
              {
                "name": "web_light",
                "title": "TopPlusOpen Light"
              }
            ],
            "opacity": 0.7,
            "showLegend": true,
            "url": "https://sgx.geodatenzentrum.de/wms_topplus_open"
          }
        ],
        "wmtsBaselayer": {
          "attribution": "",
          "layer": {
            "identifier": "de_basemapde_web_raster_grau",
            "title": "basemap.de Web Raster Grau"
          },
          "opacity": 0.8,
          "showLegend": true,
          "url": "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&custom=/test/path/file.js"
        }
      },
      "enabledForDataLinks": true,
      "opacity": 1,
      "visible": true
    },
    "controls": {
      "showZoom": true,
      "mouseWheelZoom": true,
      "showAttribution": true,
      "showLayercontrol": true,
      "showScale": true,
      "showDebug": false,
      "showSpatialFilter": true,
      "showDataExtentZoom": true,
      "showWMSLegend": true,
      "overviewMap": {
        "enabled": true,
        "config": {},
        "enabledForDataLinks": true,
        "opacity": 0.8,
        "type": "osm-standard",
        "visible": true
      }
    },
    "layers": [
      {
        "config": {
          "cluster": false,
          "clusterDistance": 20,
          "clusterMinDistance": 0,
          "clusterValue": "size",
          "color": {
            "fixed": "dark-green"
          },
          "enableGradient": false,
          "enableShadow": false,
          "fillOpacity": 0.4,
          "geoJsonStrokeSize": {
            "fixed": 5,
            "max": 10,
            "min": 1
          },
          "iconSize": 9,
          "pinShape": "marker",
          "shape": "circle",
          "showLegend": true,
          "showPin": false,
          "size": {
            "fixed": 5,
            "max": 15,
            "min": 2
          }
        },
        "enabledForDataLinks": true,
        "location": {
          "mode": "auto"
        },
        "name": "test 2",
        "query": {
          "id": "byRefId",
          "options": "B"
        },
        "type": "markers",
        "visible": true
      }
    ]
  }
}
`) as PanelModel;

describe("plugin version migration", () => {
  test("panel plugin version of v1.x without pluginVersion set and unconfigured wms as basemap", () => {
    const options = migrationHandler(PANEL_V1_WMS_NO_CONFIG_NO_PLUGIN_VERSION);
    expect(options.basemap.config.wmsBaselayer).toBeUndefined();
  })

  test("panel plugin version of v1.x without pluginVersion set and configured wms as basemap", () => {
    const options = migrationHandler(PANEL_V1_WMS_WITH_CONFIG_NO_PLUGIN_VERSION);
    expect(options.basemap.config.wmsBaselayer);
    expect(options.basemap.config.wmsBaselayer.length).toBe(1);
    expect(options.basemap.config.wmsBaselayer[0].layers.length).toBe(1);
    expect(options.basemap.config.wmsBaselayer[0].layers[0].name).toBe("web");
    expect(options.basemap.config.wmsBaselayer[0].attribution.length).toBeGreaterThan(0);
  })

  test("panel plugin version of v1.x with pluginVersion set from changing to Geomap WMS Panel from another panel and configured wms as basemap with 2 layers", () => {
    const options = migrationHandler(PANEL_V1_WMS_WITH_CONFIG_WITH_PLUGIN_VERSION_2_LAYERS);
    expect(options.basemap.config.wmsBaselayer);
    expect(options.basemap.config.wmsBaselayer.length).toBe(1);
    expect(options.basemap.config.wmsBaselayer[0].layers.length).toBe(2);
    expect(options.basemap.config.wmsBaselayer[0].attribution.length).toBeGreaterThan(0);
  })

  test("panel plugin version of v1.x with pluginVersion set from changing to Geomap WMS Panel from another panel NOT using wms as baselayer type", () => {
    const options = migrationHandler(PANEL_V1_NO_WMS_WITH_CONFIG_WITH_PLUGIN_VERSION);
    expect(options.basemap.config.wmsBaselayer).toBeUndefined();
    expect(JSON.stringify(options)).toEqual(JSON.stringify(PANEL_V1_NO_WMS_WITH_CONFIG_WITH_PLUGIN_VERSION.options));
  })

  test("panel plugin version of v2.x with pluginVersion set using configured wms as baselayer type", () => {
    const options = migrationHandler(PANEL_V2_WMS_WITH_CONFIG_WITH_PLUGIN_VERSION);
    expect(JSON.stringify(options)).toEqual(JSON.stringify(PANEL_V2_WMS_WITH_CONFIG_WITH_PLUGIN_VERSION.options));
  })

  test("panel plugin version of v2.x with pluginVersion set using configured wms as baselayer type and old icon size", () => {
    const options = migrationHandler(PANEL_V2_WMS_WITH_CONFIG_WITH_PLUGIN_VERSION_WITH_OLD_ICONSIZE);
    expect((options.layers[0].config as MarkersConfig).iconSize).toEqual({
      max: 10,
      min: 1,
      fixed: 9
    });
  })
});
