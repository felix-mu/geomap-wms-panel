import React from 'react';
import { GrafanaTheme2, PluginState, StandardEditorProps } from '@grafana/data';
import { /*CollapsableSection,*/ ControlledCollapse, /*HorizontalGroup,*/ IconButton, ToolbarButton, useStyles2, /*useTheme2*/ } from '@grafana/ui';
import { ExtendMapLayerOptions, ExtendMapLayerRegistryItem } from 'extension';
import { GeomapPanelOptions } from 'types';
import { defaultMarkersConfig } from '../layers/data/markersLayer';
import { hasAlphaPanels } from 'config';
import { LayerEditor } from './LayerEditor';
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { css } from '@emotion/css';

function dataLayerFilter(layer: ExtendMapLayerRegistryItem): boolean {
  if (layer.isBaseMap) {
    return false;
  }
  if (layer.state === PluginState.alpha) {
    return hasAlphaPanels;
  }
  return true;
}

export const DataLayersEditor: React.FC<StandardEditorProps<ExtendMapLayerOptions[], any, GeomapPanelOptions>> = ({
  value,
  onChange,
  context,
}) => {
  const styles = useStyles2(getStyles);
  // const theme = useTheme2();
  
  const onAddLayer = () => {
    let newData: ExtendMapLayerOptions[] = value ? _.cloneDeep(value) : [];
    newData.push(defaultMarkersConfig);
    onChange(newData);
  };
  const onDeleteLayer = (index: number) => {
    let newData: ExtendMapLayerOptions[] = value ? _.cloneDeep(value) : [];
    newData.splice(index, 1);
    onChange(newData);
  };
  
  return (
    <>
      <div className="data-layer-add">
        <ToolbarButton icon="plus" tooltip="add new layer" variant="primary" key="Add" onClick={onAddLayer}>
          Add Layer
        </ToolbarButton>
      </div>
      <DragDropContext onDragEnd={() => {return}}>
        <Droppable droppableId="list">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {(value || []).map((v, index) => {
                return (
                  <Draggable draggableId={v.name ? v.name + ' layer' : `unnamed layer-${index}`} index={index} key={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={styles.collapsableSectionWrapper}
                      >
                        {/* <HorizontalGroup> */}
                        <IconButton className={styles.grabButton} name="draggabledots" size="lg" iconType="default"
                             tooltip={"Drag data layer"} variant="secondary"></IconButton>
                          {/* <CollapsableSection label={v.name ? v.name + ' layer' : 'unnamed layer'} isOpen={false}> */}
                          <ControlledCollapse label={v.name ? v.name + ' layer' : 'unnamed layer'} isOpen={false}>
                            <LayerEditor
                              options={v ? v : undefined}
                              data={context.data}
                              onChange={(cfg) => {
                                let newData: ExtendMapLayerOptions[] = value ? _.cloneDeep(value) : [];
                                newData[index] = cfg;
                                onChange(newData);
                              }}
                              filter={dataLayerFilter}
                            />
                            <div className="data-layer-remove">
                              <ToolbarButton
                                icon="trash-alt"
                                tooltip="delete"
                                variant="destructive"
                                key="Delete"
                                onClick={(e) => {
                                  onDeleteLayer(index);
                                }}
                              >
                                Delete
                              </ToolbarButton>
                            </div>
                          {/* </CollapsableSection> */}
                          </ControlledCollapse>
                        {/* </HorizontalGroup> */}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  collapsableSectionWrapper: css({
    // borderColor: theme.colors.border.weak,
    // borderStyle: "solid",
    // borderRadius: theme.shape.borderRadius(1),
    // borderBottomWidth: "1px",
    // margin: "2px",
    // padding: "1px",
    display: "flex",
    alignItems: "baseline"
  }),
  grabButton: css({
    cursor: "grab",
    marginRight: "5px"
  })
});
