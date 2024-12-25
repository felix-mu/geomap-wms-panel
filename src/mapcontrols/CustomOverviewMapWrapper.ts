// import { css } from "@emotion/css";
import OverviewMap, { Options } from "ol/control/OverviewMap";
import "./customOverviewMap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

interface CustomOverviewMapOptions extends Options {

}

class CustomOverviewMapWrapper {
    protected overviewMap: OverviewMap;

    constructor(options: CustomOverviewMapOptions) {
        const icon = document.createElement("i");
        icon.setAttribute("class", "bi bi-map");

        this.overviewMap = new OverviewMap({
            className: "ol-custom-overviewmap",
            collapseLabel: "›",
            label: icon,
            ...options
        });
        // this.overviewMap.getOverviewMap().getOverlays().getArray()[0].getElement()?.classList.add(styles.solidBorder);

        // Style box overlay
        // const boxElement = this.overviewMap.getOverviewMap().getOverlays().getArray()[0].getElement();
        // if (!boxElement) {
        //     return;
        // }
        // boxElement.style.border = "1px solid red";
    }

    getOverviewMap() {
        return this.overviewMap;
    }
}

// const styles = {
//     overviewMapContainer: css({
//         right: "0.5em",
//         top: "80%",
//         border: "1px solid #7b98bc",
//         height: "15%",
//         margin: "2px",
//         width: "15%",
//     })
// };


export {CustomOverviewMapWrapper};
