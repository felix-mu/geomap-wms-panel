import { SelectableValue, StandardEditorProps } from "@grafana/data";
import { WMSConfig } from "layers/basemaps/wms";
import { CustomWMSBasemapEditor } from "./CustomWMSBasemapEditor";
import { Button } from "@grafana/ui";
import React, { useRef, useState } from "react";
import { css } from "@emotion/css";
import { v4 as uuidv4 } from 'uuid';

type Props = StandardEditorProps<WMSConfig[]>;

export const MultipleWMSEditor = ({ item, value, onChange, context }: Props) => { // onChange: https://grafana.com/developers/plugin-tools/how-to-guides/panel-plugins/custom-panel-option-editors
    const [wmsEntities, setWMSEntities] = useState<WMSConfig[]>(value !== undefined && value.length !== 0 ?
        value : []);
    
    const cacheRef = useRef<{ [url: string]: Array<SelectableValue<string>> }>({});

    function updateWMSEditor(wmsEntity: WMSConfig, index: number) {
        wmsEntities.splice(index, 1, wmsEntity);
        setWMSEntities([...wmsEntities]);
        onChange([...wmsEntities]);
    }

    function removeWMSEntity(index: number) {
        const newWMSEntities = wmsEntities.filter((_, i) => i !== index);
        setWMSEntities(newWMSEntities);
        onChange(newWMSEntities);
    }

    let wmsEditors = (value || []).map((el, index) => {
        return (
            <div key={/*crypto.randomUUID()*/ uuidv4()}>
                <CustomWMSBasemapEditor cache={cacheRef} onChange={(wmsConfig: WMSConfig) => {updateWMSEditor(wmsConfig, index)}} wms={el}/>
                <Button aria-label={`wms remove button`} style={{marginTop: "6px"}} size="sm" variant="destructive" icon="minus" type="button" onClick={() => {
                    if (wmsEntities.length === 1) {
                        setWMSEntities([]);
                        onChange([]);
                    } else {
                        // const newWMSEntities = [...wmsEntities];
                        removeWMSEntity(index);
                    }
                }}>Remove WMS</Button>
                {/* <div style={{
                    height: "3px"
                }}></div> */}
                <hr className={styles.divider}></hr>
            </div>
        )
    });

    // return <Select options={options} value={value} onChange={(selectableValue) => onChange(selectableValue.value)} />;
    return (
        <>
            {wmsEditors}
            <Button aria-label="wms add button" size="sm" variant="primary" icon="plus" type="button" onClick={() => {
                setWMSEntities([...wmsEntities, {url: "", layers: [], attribution: "", opacity: 1.0, showLegend: false}]);
                onChange([...wmsEntities, {url: "", layers: [], attribution: "", opacity: 1.0, showLegend: false}]);
            }}>Add WMS</Button>
        </>
        );
};

const styles = {
    divider: css`
    border-top: 1px solid rgba(204, 204, 220, 0.12);
    `
};
