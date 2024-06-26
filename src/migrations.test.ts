import { PanelModel, FieldConfigSource } from '@grafana/data';
import { mapPanelChangedHandler } from './migrations';

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
