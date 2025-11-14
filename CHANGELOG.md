# Changelog
## [2.0.2](https://github.com/felix-mu/geomap-wms-panel/compare/v2.0.1...v2.0.2) (2025-11-14)


### Features

* add migration handler from v1.x plugin versions to v2.x ([641a1dc](https://github.com/felix-mu/geomap-wms-panel/commit/641a1dc595583d416dfc7cf121514a7d0197a18a))


### Bug Fixes

* fix map tooltip positioning as documented in https://github.com/grafana/grafana/pull/94842 ([ede19c8](https://github.com/felix-mu/geomap-wms-panel/commit/ede19c8cf08ef8072d41e3bb8530e533806326e5))

## [2.0.1](https://github.com/felix-mu/geomap-wms-panel/compare/v2.0.0...v2.0.1) (2024-11-11)


### Features

* **mutliplewmseditor.tsx:** add stable list keys for wms editor entities ([32e98ec](https://github.com/felix-mu/geomap-wms-panel/commit/32e98ec4822743a98967801c5220e524a59f093f))
* use uuid generator that is compatible with insecure contexts ([f8f3df6](https://github.com/felix-mu/geomap-wms-panel/commit/f8f3df632867782d457f36a500223180d3437247)), closes [#52](https://github.com/felix-mu/geomap-wms-panel/issues/52)

## [2.0.0](https://github.com/felix-mu/geomap-wms-panel/compare/v1.0.1...v2.0.0) (2024-10-13)


### ⚠ BREAKING CHANGES

* **wmslegend.tsx:** Multiple WMS are now possible to use for assembling the basemap layer

### Features

* add opacity control for each WMS ([7e5db49](https://github.com/felix-mu/geomap-wms-panel/commit/7e5db49917d8058013cebc2c66cc421609ad2243))
* **wmslegend.tsx:** add WMS baselayer editor options to allow multiple WMS as baselayer ([6657d70](https://github.com/felix-mu/geomap-wms-panel/commit/6657d70c343dd75e3db5b81610ffcbe4768646fd))


### Bug Fixes

* **markerslayer.tsx:** fix handling of data series without refId ([999ff99](https://github.com/felix-mu/geomap-wms-panel/commit/999ff99f2ae6355e162a3c047f0b31dbce098fd2))
* **markerslayer.tsx:** fix refId handling in markers layer ([34e1ae1](https://github.com/felix-mu/geomap-wms-panel/commit/34e1ae1cc6458361f9bffa007e9df7c86ec38acd)), closes [#32](https://github.com/felix-mu/geomap-wms-panel/issues/32)

## [1.0.1](https://github.com/felix-mu/geomap-wms-panel/compare/v1.0.0...v1.0.1) (2024-06-13)


### Bug Fixes

* **mapvieweditor.tsx:** fix undefined lastGeomapPanelInstance which is necessary to set current view ([0d6cf89](https://github.com/felix-mu/geomap-wms-panel/commit/0d6cf89da53665a6984bfba2506a66ec6a40874b))

## 1.0.0 (2024-05-07)

_Initial release._
