import React from 'react';
import { GrafanaTheme2, StandardEditorProps } from '@grafana/data';
import { /*CollapsableSection,*/ ControlledCollapse, /*HorizontalGroup,*/ IconButton, ToolbarButton, useStyles2, /*useTheme2*/ } from '@grafana/ui';
import { ExtendMapLayerOptions, ExtendMapLayerRegistryItem } from 'extension';
import { GeomapPanelOptions } from 'types';
import { defaultMarkersConfig } from '../layers/data/markersLayer';
import { LayerEditor } from './LayerEditor';
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { css } from '@emotion/css';
import { ReducedMultipleWMSEditorContext, ReducedWMTSEditorContext } from './reducedEditorContext';

const reorder = (list: ExtendMapLayerOptions[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function dataLayerFilter(layer: ExtendMapLayerRegistryItem): boolean {
  if (layer.id === "default") {
    return false;
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

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newData: ExtendMapLayerOptions[] = reorder(
      value,
      result.source.index,
      result.destination.index
    );

    onChange(newData);
  }
  
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {(value || []).map((v, index) => {
                return (
                  <Draggable draggableId={v.name ? v.name + ' layer' : `unnamed layer-${index}`}
                       index={index} key={v.name ? v.name + ' layer' : `unnamed layer-${index}`}>
                    {(provided, snapshot) => (
                      <div
                        // data-drag-handle-el={}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={styles.collapsableSectionWrapper}
                      >
                        {/* <HorizontalGroup> */}
                        {/* Controlling a whole draggable by just a part of it: https://github.com/hello-pangea/dnd/blob/main/docs/api/draggable.md#draghandleprops-example-custom-drag-handlem */}
                        <div {...provided.dragHandleProps}> 
                          <IconButton className={styles.grabButton} name="draggabledots" size="lg" iconType="default"
                              tooltip={"Drag layer"} variant="secondary"></IconButton>
                        </div>
                          {/* <CollapsableSection label={v.name ? v.name + ' layer' : 'unnamed layer'} isOpen={false}> */}
                        <ControlledCollapse label={v.name ? v.name + ' layer' : 'unnamed layer'} isOpen={false}>
                          <ReducedMultipleWMSEditorContext.Provider value={{hideShowLegendToggle: false, hideAttributionsInput: true}}>
                            <ReducedWMTSEditorContext.Provider value={{hideShowLegendToggle: false, hideAttributionsInput: true}}>
                              <LayerEditor
                                options={v ? v : undefined}
                                data={context.data}
                                onChange={(cfg) => {
                                  let newData: ExtendMapLayerOptions[] = value ? _.cloneDeep(value) : [];
                                  // newData[index] = cfg;
                                  // cfg.opacity = cfg.opacity === undefined ? 1.0 : cfg.opacity;
                                  newData.splice(index, 1, cfg);
                                  onChange(newData);
                                }}
                                filter={dataLayerFilter}
                                showNameField={true}
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
                            </ReducedWMTSEditorContext.Provider>
                          </ReducedMultipleWMSEditorContext.Provider>
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
      <div className="data-layer-add">
        <ToolbarButton icon="plus" tooltip="add new layer" variant="primary" key="Add" onClick={onAddLayer}>
          Add Layer
        </ToolbarButton>
      </div>
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
