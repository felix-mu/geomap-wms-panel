import Attribution, { Options } from "ol/control/Attribution";
import { mapControlStyles } from "./mapControlStyles";
import { CustomizableControl } from "./CustomizableControl";
import { css } from "@emotion/css";

export class CustomAttribution extends Attribution implements CustomizableControl {
    constructor(options: Options) {
        options = options ? options : {};
        
        super({
            ...options,
            // collapseClassName: (options.collapseClassName ? options.collapseClassName + ' ' : '') + styles.attributionBorder,
            // expandClassName: (options.expandClassName ? options.expandClassName + ' ' : '') + styles.attributionBorder
        });

        this.element.classList.add(mapControlStyles.mapControl);
        this.element.classList.add(styles.attributionStyle);
        this.element.style.marginLeft = "auto";
        this.element.style.maxWidth = "300px";
    }

    removeCssClassFromElement(classToRemove: string) {
        this.element.classList.remove(classToRemove);
    }

    addCssClassToElement(classToAdd: string) {
        this.element.classList.add(classToAdd);
    }
}

const styles = {
    attributionStyle: css`
    border-radius: 2px;
    position: fixed;
    button {
        border-radius: 4px;
        border-width: 1px;
    };
    `,
    attributionBorder: css`
    border-radius: 4px;
    border-width: 1px;
    `
};
