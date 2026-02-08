import { GeomapHoverPayload } from "event";
import { DataHoverView } from "./DataHoverView";
import React, { memo } from 'react';
import { ClipboardButton, useTheme2, VizTooltipContainer } from "@grafana/ui";
import { css } from "@emotion/css";
import { computeTooltipStyle, convertMapViewExtent2LonLat, MapViewExtentLatLon } from "./tootltipUtils";

type Props = {
    tooltipData: {
        ttip?: GeomapHoverPayload;
        fixedFlag?: boolean;
    }
    mapExtent?: {
        extent: number[];
        projection: string;
    }
};

export const Tooltip = memo(function Tooltip({tooltipData, mapExtent}: Props) {
    const theme = useTheme2();

    if (!tooltipData.ttip || !tooltipData.ttip.data || !mapExtent
        || mapExtent.extent.length !== 4
        || mapExtent.projection.length === 0
        || !tooltipData.ttip.point || !tooltipData.ttip.point.lat || !tooltipData.ttip.point.lon
    ) {
        return null;
    }
    const datahoverview = (<DataHoverView {...tooltipData.ttip} />);

    let extentLonLat: MapViewExtentLatLon;
    try {
          extentLonLat = convertMapViewExtent2LonLat(mapExtent.extent, mapExtent.projection);
    } catch (error) {
        return null;
    }

    let vizTooltipStyle = computeTooltipStyle(
        (tooltipData.ttip.point as unknown) as { lon: number; lat: number; },
        extentLonLat
    );

    if (tooltipData.fixedFlag) {
        vizTooltipStyle = {
            ...vizTooltipStyle,
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: theme.colors.border.medium
        }
    }

    return (
        //   <Portal> // is the grafana portal element: https://github.com/grafana/grafana/blob/8b25822723357d32b413d950035a2a304d23b5ab/packages/grafana-ui/src/components/Portal/Portal.tsx
            <VizTooltipContainer
            className={styles.viz}
            style={vizTooltipStyle}
            position={{ x: tooltipData.ttip.pageX, y: tooltipData.ttip.pageY }}
            offset={{ x: 10, y: 10 }}
            allowPointerEvents
            >
            {datahoverview}
            {tooltipData.fixedFlag && (
                    // <div>
                    //     <i className="bi bi-copy"></i>
                    // </div>
                    // <IconButton aria-label="copy feature data to clipboard"
                    // variant="secondary" size="sm" name="copy" tooltip={"Copy feature data to clipboard"}
                    // onClick={()=>{
                    //     // TODO: 
                    //     navigator.clipboard.writeText("newClip").then(
                    //         () => {
                    //         /* clipboard successfully set */
                    //         },
                    //         () => {
                    //         /* clipboard write failed */
                    //         },
                    //     );
                    // }}></IconButton>
                    // TODO:
                    <ClipboardButton icon="copy" variant="secondary" size="sm" getText={() => "shareUrl"} fullWidth={true}>
                        Copy data
                    </ClipboardButton>
                )
            }
            </VizTooltipContainer>
        //   </Portal>
    );
}, (prevProps, nextProps) => {
    const changed = Object.is(prevProps.tooltipData.ttip?.data, nextProps.tooltipData.ttip?.data)
    && Object.is(prevProps.tooltipData.ttip?.features, nextProps.tooltipData.ttip?.features)
    //eslint-disable-next-line
    && (nextProps.tooltipData.fixedFlag == prevProps.tooltipData.fixedFlag);
    return changed;
});

const styles = {
      viz: css({
    borderRadius: "2px",
  }),
};
