# Changelog
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
