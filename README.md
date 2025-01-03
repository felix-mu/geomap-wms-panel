
<h1>
<img src="src/img/geomap-wms-logo.svg" width="150px"/>
Geomap WMS Panel Plugin


![Build](https://github.com/felix-mu/geomap-wms-panel/actions/workflows/build.yml/badge.svg) ![Test](https://github.com/felix-mu/geomap-wms-panel/actions/workflows/test.yml/badge.svg) ![e2e Playwright](https://github.com/felix-mu/geomap-wms-panel/actions/workflows/playwright.yml/badge.svg) ![Plugin validation](https://github.com/felix-mu/geomap-wms-panel/actions/workflows/validate.yml/badge.svg) ![Linting](https://github.com/felix-mu/geomap-wms-panel/actions/workflows/linting.yml/badge.svg) ![Compatibility](https://github.com/felix-mu/geomap-wms-panel/actions/workflows/levitate.yml/badge.svg) ![GitHub Release](https://img.shields.io/github/v/release/felix-mu/geomap-wms-panel)
</h1>

> 💡 This project uses [semantic versioning](https://semver.org/).

## About
This plugin evolved from the [Orchestra Cities Map Panel-Plugins](https://github.com/orchestracities/map-panel). It extends the original version by the functionality of the intergration of an [OGC Web Map Service](https://www.ogc.org/standard/wms/) (**WMS version 1.3.0**) as a base map layer. Additionally the plugin ships with an interactive filter tool to query data by spatial relations.
Also a minimal implementation of datalinks is provided to update dashboard variables by clicking on a map feature.

Due to Grafana Labs' [plugin guidelines](https://grafana.com/legal/plugins/#plugin-publishing-and-signing-criteria) it was necessary to remove the Nextzen basemap layer, since it required to store the API key in the config, which should be avoided in panel plugins.

## Features
* Integration of mutliple OGC WMS 1.3.0 from different endpoints as base map layer
* Opacity setting for each WMS endpoint
* Collapsable legend of used WNS layers
* Interactive spatial filter
* Minimal data links implementation

## Migration from Geomap WMS Panel Plugin v1.0.1
Due to the capability of using multiple WMS endpoints as base map layer a change in the plugin configuration object was required, not being backwards compatible with the configuration object used for plugins of version 1.y.z.

Dashboards using the Geomap WMS Panel Plugin of major version 1 and using a WMS as base map layer that want to use the latest version of the plugin need to migrate their panel's JSON definition.

> ⚠️ The migration is **only** mandatory for plugins that use a WMS as a base map layer. Panels that use other base maps than the WMS base map do not require any action. ⚠️

### Example of a migration
JSON definition of WMS baselayer in plugin version 1.y.z:
```json
...
"basemap": {
      "type": "wms",
      "config": {
        "layer": [
          "g_stadtkarte_gesamt"
        ],
        "url": "https://geoportal.muenchen.de/geoserver/gsm/wms?"
      }
    },
...
```

Corresponding JSON definition of WMS baselayer in plugin version 2.y.z:
```json
...
"basemap": {
      "type": "wms",
      "config": {
        "wmsBaselayer": [
          {
            "url": "https://geoportal.muenchen.de/geoserver/gsm/wms?",
            "layers": ["g_stadtkarte_gesamt"],
            "attribution": "",
            "opacity": 1,
            "showLegend": false
          }
        ]
      }
    },
...
```

The JSON definition of the panel might be edited directly in the Grafana GUI.

> ⚠️ Make sure to backup your dashboard before editing it or make use of the versioning functionality of Grafana to rollback changes if editing is gone wrong ⚠️

## Using the Geomap WMS Panel Plugin
> ⚠️ Currently only WMS of version 1.3.0 are supported ⚠️
1. In the selection _Base layer_ choose the type _OGC Web Map Sevice_
2. Click the button _+ Add WMS_ to open the WMS dialog
3. In the text field _URL_ type in the base url of the WMS endpoint (NOTE: Only the URL of the service endpoint **WITHOUT** request parameters, e.g. https://geoportal.muenchen.de/geoserver/gsm/wms)
4. Choose one or multiple layers from the drop down list
5. Adjust the opacity of the WMS entry (affects all layers of the wms entry; to use the same WMS endpoint and apply different opacities to layers add multiple entries via the _+ Add WMS_)
6. Optionally toggle the legend button to display a legend containing the icons of the selected WMS layers
7. Optionally provide an attribution for the WMS endpoint
8. To remove an entry click on the button _- Remove WMS_

![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/grafana_multiple_layers.PNG)

### Example 1): WMS Basemap with 3 layers
Layer names:
- g_stadtkarte_gesamt_gtay
- g_stadtspaziergang_moosach_route_a
- baustellen_2_weeks

![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/multiple_layers_wms.PNG)

### Example 2): WMS Basemap with 3 layers (layer names have whitespaces)
Layer names:
- Blöcke
- Linie_u_Stadtplanü. bis 150k
- stehende Gewässer generalisiert

![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/mutli-layer-whitespaces.PNG)

### ⚠️ Using field names for styling layers with color schemes
When using multiple queries in the Geomap Panel it is required to pay attention to the selection of fields for layer style configuration (e.g. by the standard options). E.g. in the case of configuring the marker color based on the color scheme in the standard options editor it is needed to use the fields indicated by '_(base field names)_' for that (might be also fixing issues when choosing the field name for geometry), otherwise the field is not applied to the standard options editor.
![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/layer_style_0.PNG)
![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/layer_style_1.PNG)


## ⚠️ Troubleshooting data layers when merging multiple datasource queries into one map layer
In some occasions it might be necessary to join mutliple datasource queries into one output dataset to summarize information coming from different sources in a single map layer. This can be achieved by applying [transformations](https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/transform-data/) on the returned data frames.

![alt text](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/multiple_queries.png)

![alt text](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/transform_data.png)

This often results in data structure like the following which might be inspected in the [debug](https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/transform-data/#debug-a-transformation) view in the transformations panel missing the metadata properties like query "name" and "refId".

![alt text](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/dataframe_after_transformation.png)

The above data structure is not compatible with Geomap Panel Plugin's query input which expects a data frame with metadata fields like "refId" or "meta".

![alt text](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/dataframe.png)

A workaround to solve this problem is to use the [prepare time series transformation](https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/transform-data/#prepare-time-series) with the setting _"Wide time series"_ as last transformation in the processing chain.

![alt text](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/preparetimeseries.png)

The latter trasnformation a "meta" field to the data object and therefore can now be processed by the Geomap Panel Plugin.

![alt text](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/dataframe_final.png)

## Using the spatial filter tool
An additional feature of the Geomap WMS Plugin is the spatial filter tool that allows drawing a polygon on the map panel to be used as filter for a data query. The polygon is representated as [Well-known-text (WKT)](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) and stored in a dashboard variable "geomap_wms_spatial_filter_geometry".

> ⚠️ It is mandatory to name the dashbaord variable "geomap_wms_spatial_filter_geometry" ⚠️

> ⚠️ 
The spatial filter tool uses the geographic coordinate system _urn:ogc:def:crs:OGC::CRS84_ with the axis order _longitude, latitude_. Openlayers (dependency of the geomap plugin) uses the CRS _CSR:84_ as alias for _EPSG:4326_ ([source](https://openlayers.org/en/latest/apidoc/module-ol_proj_Projection-Projection.html)), even if the official axis order of _EPSG:4326_ defines _latitude_, _longitude_. This is because the  [Proj4Js-Library](https://github.com/proj4js/proj4js?tab=readme-ov-file#axis-order) uses the order `[x=longitude,y=latitude]` by default.
⚠️

To enable the spatial filter tool follow the steps below:

1. Create a [dashboard variable](https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/) of type "Textbox" or "Custom" (eventually set the display property to "Nothing" to hide the variable from the user) and the name "geomap_wms_spatial_filter_geometry" (**the spatial filter tool will update this variable internally and as for now does not provide the functionality of setting a different variable name externally**). As initial value use e.g. `POLYGON((-180 -90,180 -90,180 90,-180 90,-180 -90))`, to selec all, if no polygon is drawn.

![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/spatial_filter_2.png)

2. Use the dashboard variable in a datasource query, e.g. the SensorThings API, which allows the filtering by providing a WKT in the geometry function:

`/Things?$expand=Locations&$filter=substringof(name,'${tree_sensor:csv}') and st_intersects(Locations/location, geography'${geomap_wms_spatial_filter_geometry}')`

![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/spatial_filter_5.png)

3. Enable the tool in the panel editor, press save or apply and leave edit mode

![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/spatial_filter_3.png)

4. Activate the tool in the panel

![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/spatial_filter_0.png)

5. Draw a polygon as spatial filter geometry. To apply the geometry set the last point on the starting point. After that the panels and datasources which use the variable "geomap_wms_spatial_filter_geometry" are updated automatically. To delete the geometry click on the cross symbol.

![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/spatial_filter_1.png)

![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/spatial_filter_4.png)

## Using data links
The Geomap WMS Panel Plugin allows the use of [dataLinks](https://grafana.com/docs/grafana/latest/panels-visualizations/configure-data-links/) to update a dashboard variable with data of the clicked feature. This enables interactions between the map panel and other panels in the dashbaord, which use the same dashboard variable in their data queries.
To make use of this functionality a datalink has to be created (see the [official documentation](https://grafana.com/docs/grafana/latest/panels-visualizations/configure-data-links/#add-a-data-link)) on how to do that.

> ⚠️ As of now the plugin is only able to handle 1 (the first) data link ⚠️

This example demonstrates how to configure the Geomap WMS Panel Plugin to update a dashboard variable "ladestationen" with the value of the data field of name "name" by clicking on a feature on the map.

![alt text](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/datalinks_3.png)

![alt text](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/datalinks_0.png)

Clicking on a certain feature on the map results in both, updating the map as well as all the panels which use the dashboard variable "ladestationen" in their queries.

Before:
![alt text](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/datalinks_1.png)

After:
![alt text](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/datalinks_2.png)

# Development
## Status of the original repository
This repository refers to the following version of its original: https://github.com/orchestracities/map-panel/tree/c0d3a19ce910b9c3ab8416f5a609afb10ff8c0fe

## Technical setup
- Grafana >= 10.0.2 as Docker container with [bind mounts to host filesystem](https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/#use-bind-mounts) mounting following container directory _/var/lib/grafana/plugins_
- node v20.3.1
- npm 10.5.0
- Linux-based OS Windows with WSL
<!-- - Docker (Desktop) -->
<!-- - Minikube
- Helm -->

## Run the tests
### Unit/integration tests
```bash
npm run test:all
```

### E2E tests
> Requires a Docker container of grafana running on localhost:3000 with default credentials (user: admin, password: admin).
```bash
npm run e2e
```

## Building the plugin
1. Clone the repository
```bash
git clone https://github.com/felix-mu/geomap-wms-panel.git
```
2. Navigate in the directory _geomap-wms-panel_
```bash
cd ./geomap-wms-panel
```
3. Install the node modules
```bash
npm install
```
4. Run build script
```bash
npm run build
```

## Building the plugin for development/debugging
Repeat the steps 1 to 3 from [Building the plugin](#building-the-plugin).

Then run:
```bash
npm run dev
```

## Deploy the (unsigned) plugin to the docker container (for debugging)
The packed plugin (either [production build](#building-the-plugin) or [development build](#building-the-plugin-for-developmentdebugging)) is found in the output folder `./felixrelleum-geomapwms-panel`.
To allow grafana to load an _unsigned_ plugin the container environment variable `GF_PLUGINS_ALLOW_UNSIGNED_PLUGINS=<comma separated list of plugin-ids>` must be set to "felixrelleum-geomapwms-panel".
Additionally it is required to configure a _bind mount_ of the _plugins_ container directory to the host filesystem where the bundled Geomap WMS Panel Plugin is located.

**Shortcut:**
Run the [docker-compose.yaml](https://github.com/felix-mu/geomap-wms-panel/blob/main/docker-compose.yaml) with `docker compose up`

If the plugin was build with `npm run dev` the Webpack directories are loaded to the browser. This enables the use of developmer tools of the browser to set breakpoints and debug the plugin source code (it is recommended to deactivate the cache).

![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/debugging_1.PNG)
![](https://raw.githubusercontent.com/felix-mu/geomap-wms-panel/main/debugging.PNG)

## ⚠️ Troubleshooting
After each build the Docker-Container must be restarted to reload the new version of the plugin. If the changes of the plugin are **not** noticed it might help to clear the browser cache and refresh the page.

## Validate the plugin
```bash
npm run validate
```

## Use automatic generation of changelog
At first bump the version of the npm package (package.json and package-lock.json):
```bash
npm --no-git-tag-version version <version>
```
Run the [automatic changelog generation](https://github.com/absolute-version/commit-and-tag-version?tab=readme-ov-file#how-it-works):
```bash
npm run release
```
Commit the changelog changes, tag the latest commit and push everything:
```bash
git add . && npm run commit
```
```bash
git push origin main
```
```bash
git tag v<version> && git push origin main v<version>
```

# Contributing
See [Contributing guide](https://github.com/felix-mu/geomap-wms-panel/blob/main/CONTRIBUTING.md) for how to contribute to the project.

# Further resources
- [Grafana and Docker](https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/)
- [Configure Grafana in Docker](https://grafana.com/docs/grafana/latest/setup-grafana/configure-docker/)
- [Build tools for plugins](https://grafana.com/developers/plugin-tools/)
- [Create a panel plugin](https://grafana.com/docs/grafana/latest/developers/plugins/create-a-grafana-plugin/develop-a-plugin/build-a-panel-plugin/)
- [Sample plugins](https://github.com/grafana/grafana-plugin-examples/tree/main/examples)
- [Grafana UI catalog](https://developers.grafana.com/ui/latest/index.html)