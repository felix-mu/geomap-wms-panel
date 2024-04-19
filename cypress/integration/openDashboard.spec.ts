import { e2e } from '@grafana/e2e';
import { testIds } from '../../src/e2eTestIds';

const { geomapPanel } = e2e.getSelectors(testIds);

describe('Open test dashboard with geomap panel', () => {
    beforeEach(() => {
        e2e.flows.login();
        e2e.flows.openDashboard({
          uid: 'b023342f-16fb-4fd8-a398-b29a17497d1b',
        });
      });
    
    it('Check if the panel is visible in the dashboard', () => {
        geomapPanel.container().should('be.visible');
    });
  });

//   Following works as well without explicitely login
// e2e.scenario({
//     describeName: 'Open test dashboard with geomap panel',
//     itName: 'Check if the panel is visible in the dashboard',
//     scenario: () => {
//         e2e.flows.openDashboard({
//         uid: 'b023342f-16fb-4fd8-a398-b29a17497d1b',
//         });
//         geomapPanel.container().should('be.visible');
//     },
// });
