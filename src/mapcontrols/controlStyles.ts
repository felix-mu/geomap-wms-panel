import { css } from "@emotion/css";

export const controlStyles = () => {
    return ({
        mapControl: css({
            pointerEvents: "auto",
            position: "static",
            marginBottom: "4px"
        }),
        border: css`
        border-radius: 4px;
        border-width: 1px;
        `
    });
}
