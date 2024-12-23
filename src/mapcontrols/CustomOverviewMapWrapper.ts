// import { css } from "@emotion/css";
import OverviewMap, { Options } from "ol/control/OverviewMap";

interface CustomOverviewMapOptions extends Options {

}

class CustomOverviewMapWrapper {
    protected overviewMap: OverviewMap;

    constructor(options: CustomOverviewMapOptions) {
        this.overviewMap = new OverviewMap(options);
        // this.overviewMap.getOverviewMap().getOverlays().getArray()[0].getElement()?.classList.add(styles.solidBorder);

        // Style box overlay
        const boxElement = this.overviewMap.getOverviewMap().getOverlays().getArray()[0].getElement();
        if (!boxElement) {
            return;
        }
        boxElement.style.borderStyle = "solid";

        // Style overview map
        // this.overviewMap.getOverviewMap().get
    }

    getOverviewMap() {
        return this.overviewMap;
    }
}

// const styles = {
//     ".ol-overviewmap": {
//         left: "0.5em";
//         bottom: "0.5em";
//       }
//       ".ol-overviewmap.ol-uncollapsible":{
//         bottom: 0;
//         left: 0;
//         borderRadius: 0 4px 0 0;
//       }
//       .ol-overviewmap .ol-overviewmap-map,
//       .ol-overviewmap button {
//         display: block;
//       }
//       .ol-overviewmap .ol-overviewmap-map {
//         border: 1px solid #7b98bc;
//         height: 150px;
//         margin: 2px;
//         width: 150px;
//       }
// }

export {CustomOverviewMapWrapper};
