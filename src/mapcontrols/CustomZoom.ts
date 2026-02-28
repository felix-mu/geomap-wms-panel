import { css } from "@emotion/css";
import Zoom, { Options } from "ol/control/Zoom";
import { controlStyles } from "./controlStyles";

export class CustomZoom extends Zoom {
    constructor(options: Options) {
        options = options ? options : {};
        
        super({
            ...options,
            zoomInClassName: styles.zoomButton,
            zoomOutClassName: styles.zoomButton,
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
