import React, { FC } from 'react';
import { config } from '@grafana/runtime';
import { GeomapPanelOptions } from '../types';
import { LayerEditor } from './LayerEditor';
import { ExtendMapLayerRegistryItem, ExtendMapLayerOptions } from 'extension';
import { StandardEditorProps } from '@grafana/data';

function baseMapFilter(layer: ExtendMapLayerRegistryItem): boolean {
  if (!layer.isBaseMap) {
    return false;
  }
  return true;
}

export const BaseLayerEditor: FC<StandardEditorProps<ExtendMapLayerOptions, any, GeomapPanelOptions>> = ({
  value,
  onChange,
  context,
}) => {
  if (config.geomapDisableCustomBaseLayer) {
    return <div>The base layer is configured by the server admin.</div>;
  }

  return <LayerEditor 
      options={value} data={context.data} 
      onChange={onChange} filter={baseMapFilter} 
      showNameField={false} isBaselayerEditor={true} />;
};
