import { 
    // GrafanaTheme2, 
    StandardEditorProps, StandardEditorsRegistryItem } from "@grafana/data";
import { 
    // ControlledCollapse, 
    CollapsableSection, Switch, 
    // useStyles2,
} from "@grafana/ui";
import React from "react";
// import { ExtendMapLayerOptions } from "extension";
import { OverviewMapConfig } from "types";
import { BaseLayerEditor } from "./BaseLayerEditor";
import { ExtendMapLayerOptions } from "extension";
import { css } from "@emotion/css";
// import { ExtendMapLayerOptions } from "extension";
// import { ExtendMapLayerOptions } from "extension";


// type Props = StandardEditorProps<number, Settings>;
// type Props = StandardEditorProps<any, OverviewMapConfig, any, any>;
type Props = StandardEditorProps<OverviewMapConfig, any, any, any>;

export const OverviewMapEditor = ({ item, value, onChange, context }: Props) => {
    // const styles = useStyles2(getStyles);
    return (
        <>
            <Switch disabled={false} value={value.enabled} onChange={() => {
                const newValue: OverviewMapConfig = value.enabled ? {enabled: false, type: ""} : {enabled: true, type: "default", config: {}}
                onChange(newValue);
            }} />
            {/* https://react.dev/learn/conditional-rendering#logical-and-operator- */}
            { value.enabled && 
                <>
                    <hr className={getStyles().divider}/>
                    <CollapsableSection className={getStyles().basemapEditor} label={"Overview map configuration"} isOpen={false}>
                        <BaseLayerEditor value={value}
                        onChange={onChange as (value?: ExtendMapLayerOptions<any> | undefined) => void} 
                        context={context} item={item as unknown as StandardEditorsRegistryItem<ExtendMapLayerOptions<any>, any>}/>
                    </CollapsableSection>
                    <hr className={getStyles().divider}/>
                </>
            }
        </>
    );
};

const getStyles = (/*theme: GrafanaTheme2*/) => (
    {
        basemapEditor: css({
            fontSize: "smaller"
        }),
        divider: css({
            marginTop: "0px"
        })
    }
);
