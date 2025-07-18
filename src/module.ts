import { PanelPlugin } from '@grafana/data';
import { BaseLayerEditor } from './editor/BaseLayerEditor';
import { DataLayersEditor } from './editor/DataLayersEditor';
import { GeomapPanel } from './GeomapPanel';
import { MapViewEditor } from './editor/MapViewEditor';
import { defaultView, GeomapPanelOptions } from './types';
import { mapPanelChangedHandler } from './migrations';
import { DEFAULT_BASEMAP_CONFIG } from './layers/registry';
import { OverviewMapEditor } from 'editor/OverviewMapEditor';

export const plugin = new PanelPlugin<GeomapPanelOptions>(GeomapPanel)
  .setNoPadding()
  .setPanelChangeHandler(mapPanelChangedHandler)
  .useFieldConfig()
  .setPanelOptions((builder) => {
    let category = ['Map view'];
    builder.addCustomEditor({
      category,
      id: 'view',
      path: 'view',
      name: 'Initial view', // don't show it
      description: 'This location will show when the panel first loads',
      editor: MapViewEditor,
      defaultValue: defaultView,
    });

    builder.addBooleanSwitch({
      category,
      path: 'view.shared',
      description: 'Use the same view across multiple panels.  Note: this may require a dashboard reload.',
      name: 'Share view',
      defaultValue: defaultView.shared,
    });

    builder.addCustomEditor({
      category: ['Base layer'],
      id: 'basemap',
      path: 'basemap',
      name: 'Base layer',
      editor: BaseLayerEditor,
      defaultValue: DEFAULT_BASEMAP_CONFIG,
    });

    builder.addCustomEditor({
      category: ['Map layers'],
      id: 'layers',
      path: 'layers',
      name: 'Map layers',
      editor: DataLayersEditor,
    });

    // The controls section
    category = ['Map controls'];
    builder
      .addBooleanSwitch({
        category,
        path: 'controls.showZoom',
        description: 'show buttons in the upper left',
        name: 'Show zoom control',
        defaultValue: true,
      })
      .addBooleanSwitch({
        category,
        path: 'controls.mouseWheelZoom',
        name: 'Mouse wheel zoom',
        defaultValue: true,
      })
      .addBooleanSwitch({
        category,
        path: 'controls.showAttribution',
        name: 'Show attribution',
        description: 'Show the map source attribution info in the lower right',
        defaultValue: true,
      })
      .addBooleanSwitch({
        category,
        path: 'controls.showLayercontrol',
        name: 'Show layer control',
        description: 'Allow to select layers',
        defaultValue: true,
      })
      .addBooleanSwitch({
        category,
        path: 'controls.showScale',
        name: 'Show scale',
        description: 'Indicate map scale',
        defaultValue: false,
      })
      .addBooleanSwitch({
        category,
        path: 'controls.showDebug',
        name: 'Show debug',
        description: 'Show map info',
        defaultValue: false,
      })
      .addBooleanSwitch({
        category,
        path: 'controls.showSpatialFilter',
        name: 'Show spatial filter tool',
        description: 'Show tool for interactive spatial filtering',
        defaultValue: false,
      })
      .addBooleanSwitch({
        category,
        path: 'controls.showDataExtentZoom',
        name: 'Show data extent zoom',
        description: 'Fit map view to data extent',
        defaultValue: true,
      })/*.addNestedOptions({ // https://community.grafana.com/t/panel-options-subcategories/107812
        path: '',
        build: function (builder: PanelOptionsEditorBuilder<unknown>, context: StandardEditorContext<unknown, any>): void {
          throw new Error('Function not implemented.');
        }
      }).*/
      .addCustomEditor({
        category,
        path: 'controls.overviewMap',
        name: 'Show overview map',
        description: 'Add collapsible overview map',
        defaultValue: {enabled: false},
        editor: OverviewMapEditor,
        id: 'overviewmap'
      });
  });
