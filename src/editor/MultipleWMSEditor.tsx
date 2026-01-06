import { SelectableValue, StandardEditorProps } from "@grafana/data";
import { WMSConfig } from "layers/basemaps/wms";
import { CustomWMSBasemapEditor } from "./CustomWMSBasemapEditor";
import { Button, ControlledCollapse } from "@grafana/ui";
import React, { useRef } from "react";
import { css } from "@emotion/css";
import { v4 as uuidv4 } from 'uuid';

type Props = StandardEditorProps<WMSConfig[]>;

export const MultipleWMSEditor = ({ item, value, onChange, context }: Props) => { // onChange: https://grafana.com/developers/plugin-tools/how-to-guides/panel-plugins/custom-panel-option-editors
    // const [wmsEntities, setWMSEntities] = useState<WMSConfig[]>(value !== undefined && value.length !== 0 ?
    //     value : []);
    
    const cacheRef = useRef<{ [url: string]: Array<SelectableValue<string>> }>({});

    const wmsEntityIDs = useRef<string[]>([]);

    function updateWMSEditor(wmsEntity: WMSConfig, index: number) {
        value.splice(index, 1, wmsEntity);
        onChange([...value]);
    }

    function removeWMSEntity(value: WMSConfig[], index: number) {
        const newWMSEntities = value.filter((_, i) => i !== index);
        onChange(newWMSEntities);
    }

    let wmsEditors = (value || []).map((el, index) => {
        if(!wmsEntityIDs.current[index]) {
            wmsEntityIDs.current.push(uuidv4());
        }
        
        return (
            <div key={wmsEntityIDs.current[index]}>
                <ControlledCollapse label={`WMS #${index}`} isOpen={true} collapsible={true}>
                    <CustomWMSBasemapEditor cache={cacheRef} onChange={(wmsConfig: WMSConfig) => {updateWMSEditor(wmsConfig, index)}} wms={el}/>
                    <Button aria-label={`wms remove button`} style={{marginTop: "6px"}} size="sm" variant="destructive" icon="minus" type="button" onClick={() => {
                        if (value.length === 1) {
                            onChange([]);
                        } else {
                            removeWMSEntity(value, index);
                        }
                    }}>Remove WMS</Button>
                    {/* <div style={{
                        height: "3px"
                    }}></div> */}
                </ControlledCollapse >
                <hr className={styles.divider}></hr>
            </div>
        )
    });

    return (
        <>
            {wmsEditors}
            <Button aria-label="wms add button" size="sm" variant="primary" icon="plus" type="button" onClick={() => {
                onChange([...value, {url: "", layers: [], attribution: "", opacity: 1.0, showLegend: false}]);
            }}>Add WMS</Button>
        </>
        );
};

const styles = {
    divider: css`
    border-top: 1px solid rgba(204, 204, 220, 0.12);
    `
};
