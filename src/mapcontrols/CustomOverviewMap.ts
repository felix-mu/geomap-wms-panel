// import { css } from "@emotion/css";
import OverviewMap, { Options } from "ol/control/OverviewMap";

class CustomOverviewMap extends OverviewMap {
    constructor(options: Options) {
        super(options);

        
    }
}

// const styles = {
//     extent: css({
//         borderStyle: "solid",
//     })
// }

export {CustomOverviewMap};
