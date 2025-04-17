import { Feature, Map, View } from "ol";
import { Extent } from "ol/extent";
import { Polygon } from "ol/geom";
import { fromExtent } from "ol/geom/Polygon";
import VectorLayer from "ol/layer/Vector";
import { register } from "ol/proj/proj4";
import VectorSource from "ol/source/Vector";
import proj4 from "proj4";

describe("data extent zoom button", () => {
  // Register projection
  proj4.defs("EPSG:32632","+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs +type=crs");
  register(proj4);
  
  // Map instance
  const map = new Map({
    view: new View({
      center: [0, 0],
      zoom: 1,
      projection: "EPSG:32632"
    }),
    layers: [],
    target: 'map',
  });

  // Feature geometry
  const extent: Extent = [679332.693242, 5324209.346437, 711232.846602, 5348237.327872];
  const bboxGeometry: Polygon = fromExtent(extent);
  const feature: Feature = new Feature(bboxGeometry);

  const vectorSrc: VectorSource = new VectorSource({
    features: [feature]
  });
  const vectorLayer: VectorLayer<VectorSource> = new VectorLayer({
    source: vectorSrc
  });

  test("should update map extent according to the features geometries' extent", () => {
    
  });

});