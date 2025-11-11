// import { css } from "@emotion/css";
import OverviewMap, { Options } from "ol/control/OverviewMap";

interface CustomOverviewMapOptions extends Options {

}

class CustomOverviewMapWrapper {
    protected overviewMap: OverviewMap;

    constructor(options: CustomOverviewMapOptions) {
        const icon = document.createElement("i");
        icon.setAttribute("class", "bi bi-map");
        icon.style.cursor = "pointer";

        const collapseLabelParent = document.createElement("div");
        collapseLabelParent.setAttribute("style", "height: 100%; display: flex;");

        const collapseLabel = document.createElement("span");
        collapseLabel.style.margin = "auto";
        collapseLabel.innerText = "›";

        collapseLabelParent.appendChild(collapseLabel)

        this.overviewMap = new OverviewMap({
            className: "ol-custom-overviewmap",
            collapseLabel: collapseLabelParent,
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
