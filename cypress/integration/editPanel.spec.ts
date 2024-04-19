import { e2e } from '@grafana/e2e';
import { testIds, ariaLabels } from '../../src/e2eTestIds';

const { geomapPanel } = e2e.getSelectors(testIds);
const ariaLabelsSelectors = e2e.getSelectors(ariaLabels);

const panelTitle = 'Geomap WMS Panel';
const baseLayerName = 'OGC Web Map Service';
const wmsUrl = 'www.example-wms.org';

describe('Open test dashboard with geomap panel and enter edit mode', () => {
    beforeEach(() => {
        e2e.flows.login();
        e2e.flows.openDashboard({
          uid: 'b023342f-16fb-4fd8-a398-b29a17497d1b',
        });
      });
    
    it('Select WMS as base layer and type URL', () => {
        e2e.flows.openPanelMenuItem(e2e.flows.PanelMenuItems.Edit, panelTitle);

        // Change default base layer to WMS layer
        e2e.components.PanelEditor.OptionsPane.content().
        within(() => {
                ariaLabelsSelectors.baseLayerField().should('be.visible').click();
            }
        );
        
        e2e().contains(baseLayerName).parent().click();
        ariaLabelsSelectors.baseLayerField().contains('div', baseLayerName).should('be.visible');
    });

    it('Type URL to WMS endpoint', () => {
        e2e.flows.openPanelMenuItem(e2e.flows.PanelMenuItems.Edit, panelTitle);

        // Change default base layer to WMS layer
        e2e.components.PanelEditor.OptionsPane.content().
        within(() => {
                ariaLabelsSelectors.baseLayerField().should('be.visible').click();
            }
        );
        
        e2e().contains(baseLayerName).parent().click();
        ariaLabelsSelectors.baseLayerField().contains('div', baseLayerName).should('be.visible');
        
        e2e.components.PanelEditor.OptionsPane.content().
        within(() => {
                ariaLabelsSelectors.urlField().should('be.visible').within((subject) => {
                    e2e().get('input', {withinSubject: subject}).type(wmsUrl, {force: true}).
                    trigger("keyup", { keyCode: 13, which: 13 }).
                    should('have.value', wmsUrl);
                });
            }
        );
            
        e2e.components.PanelEditor.applyButton().click({force: true});

        geomapPanel.container().should('be.visible');
    });
  });
