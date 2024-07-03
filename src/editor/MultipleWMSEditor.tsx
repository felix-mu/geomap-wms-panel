import { StandardEditorProps } from "@grafana/data";
import { WMSConfig } from "layers/basemaps/wms";
import { CustomWMSBasemapEditor } from "./CustomWMSBasemapEditor";
import { Button } from "@grafana/ui";
import React, { useState } from "react";
import { css } from "@emotion/css";


type Props = StandardEditorProps<WMSConfig[]>;

export const MultipleWMSEditor = ({ item, value, onChange, context }: Props) => {
    const [wmsEntities, setWMSEntities] = useState<Array<WMSConfig>>(value !== undefined && value.length !== 0 ?
        value : []);

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
            <div key={crypto.randomUUID()}>
                <CustomWMSBasemapEditor onChange={(wmsConfig: WMSConfig) => {updateWMSEditor(wmsConfig, index)}} wms={el}/>
                {/* <Input value={url} aria-label="attribution input"
                    onChange={e => {
                        setURL(e.currentTarget.value);
                        if (wms) {
                        (wms.layers as string[]).splice(-1);
                        }
                        setOptions([]);
                        setSelection([]);
                }}></Input> */}
                <Button style={{marginTop: "6px"}} size="sm" variant="destructive" icon="minus" type="button" onClick={() => {
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
            <Button size="sm" variant="primary" icon="plus" type="button" onClick={() => {
                setWMSEntities([...wmsEntities, {url: "", layers: []}]);
                onChange([...wmsEntities, {url: "", layers: []}]);
            }}>Add WMS</Button>
        </>
        );
};

const styles = {
    divider: css`
    border-top: 1px solid rgba(204, 204, 220, 0.12);
    `
};