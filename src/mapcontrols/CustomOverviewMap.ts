import OverviewMap, { Options } from "ol/control/OverviewMap";
import { CustomizableControl } from "./CustomizableControl";
import { css } from "@emotion/react";
import { mapControlStyles } from "./mapControlStyles";

class CustomOverviewMap extends OverviewMap implements CustomizableControl {
    // protected overviewMap: OverviewMap;

    constructor(options: Options) {
        const icon = document.createElement("i");
        icon.setAttribute("class", "bi bi-map");
        icon.style.cursor = "pointer";

        const collapseLabelParent = document.createElement("div");
        collapseLabelParent.setAttribute("style", "height: 100%; display: flex;");

        const collapseLabel = document.createElement("span");
        collapseLabel.style.margin = "auto";
        collapseLabel.innerText = "›";

        collapseLabelParent.appendChild(collapseLabel)

        super({
            ...options,
            collapseLabel: collapseLabelParent,
            label: icon,
            className: (options.className ? options.className + ' ' : '') + styles.collapseButton + ' ' + mapControlStyles.border
        });

        // icon.addEventListener("click", () => {
        //     this.element.
        // });
    }
    
    removeCssClassFromElement(classToRemove: string) {
        this.element.classList.remove(classToRemove);
    }

    addCssClassToElement(classToAdd: string) {
        this.element.classList.add(classToAdd);
    }
}

const styles = {
    collapseButton: css({
        position: "static"
    })
//     overviewMapContainer: css({
//         right: "0.5em",
//         top: "80%",
//         border: "1px solid #7b98bc",
//         height: "15%",
//         margin: "2px",
//         width: "15%",
//     })
};


export { CustomOverviewMap };
