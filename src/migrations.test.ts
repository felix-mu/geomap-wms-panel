import { PanelModel, FieldConfigSource } from '@grafana/data';
import { mapPanelChangedHandler, migrationHandler } from './migrations';

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
});
