import { Feature, Map, View } from "ol";
import { Extent, getBottomLeft, getTopRight } from "ol/extent";
import { Polygon } from "ol/geom";
import { fromExtent } from "ol/geom/Polygon";
import VectorLayer from "ol/layer/Vector";
import { register } from "ol/proj/proj4";
import VectorSource from "ol/source/Vector";
import proj4 from "proj4";
import { DataExtentZoom } from "./DataExtentZoom";

describe("data extent zoom button", () => {
  // Register projection
  proj4.defs("EPSG:25832","+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
  register(proj4);
  
  // Map instance
  const map = new Map({
    view: new View({
      center: [0, 0],
      zoom: 1,
      projection: "EPSG:25832" // https://openlayers.org/en/latest/apidoc/module-ol_View-View.html otherwise the geometries must be converted in the respective crs
    }),
    layers: [],
    target: 'map',
  });

  // Feature geometry
  const extentForPolygon: Extent = [674378.627100, 5326091.077753, 713858.922998, 5350791.513888];
  const bboxGeometry: Polygon = fromExtent(extentForPolygon);
  const feature: Feature = new Feature(bboxGeometry);

  const vectorSrc: VectorSource = new VectorSource({
    features: [feature]
  });
  const vectorLayer: VectorLayer<VectorSource> = new VectorLayer({
    source: vectorSrc
  });

  map.addLayer(vectorLayer);

  // Create target element for control to be able to dispatch click event on it
  const targetElement = document.createElement('div');
  const datazoomExtentControl: DataExtentZoom = new DataExtentZoom({target: targetElement});
  map.addControl(datazoomExtentControl);

  test("should update map extent according to the features geometries' extent", () => {
    // Trigger data extent zoom control  
    const button = targetElement.querySelector("button");
    button!.dispatchEvent(new MouseEvent("click", {bubbles: true}));

    // Get new map extent
    const mapExtent: Extent = map.getView().calculateExtent();

    const [minX, minY] = getBottomLeft(mapExtent);
    const [maxX, maxY] = getTopRight(mapExtent);

    const mapExtentContainsFeatureGeometry: boolean = minX < extentForPolygon[0] && minY < extentForPolygon[1] &&
      maxX > extentForPolygon[2] && maxY > extentForPolygon[3];

    expect(mapExtentContainsFeatureGeometry).toBeTruthy();

  });

});