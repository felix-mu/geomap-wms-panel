import { css } from "@emotion/css";
import Zoom, { Options } from "ol/control/Zoom";
import { controlStyles } from "./controlStyles";
import { CustomizableControl } from "./CustomizableControl";

export class CustomZoom extends Zoom implements CustomizableControl {
    constructor(options: Options) {
        options = options ? options : {};
        
        super({
            ...options,
            zoomInClassName: (options.zoomInClassName ? options.zoomInClassName + ' ' : '') + styles.zoomButton,
            zoomOutClassName: (options.zoomOutClassName ? options.zoomOutClassName + ' ' : '') + styles.zoomButton,
        });

        this.element.classList.add(controlStyles().mapControl);
        this.element.classList.add(styles.zoomStyle);
    }

    removeCssClassFromElement(classToRemove: string) {
        this.element.classList.remove(classToRemove);
    }

    addCssClassToElement(classToAdd: string) {
        this.element.classList.add(classToAdd);
    }
}

const styles = {
    zoomStyle: css`
    display: inline-flex;
    flex-direction: column;
    `,
    zoomButton: css`
    border-radius: 4px;
    border-width: 1px;
    `
};
