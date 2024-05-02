import { test, expect, DashboardPage } from '@grafana/plugin-e2e';
import { WMS_ENDPOINT, HAR_FILEPATH, UPDATE_HAR } from './test_config';
import { Locator } from '@playwright/test';
import { update } from 'lodash';
// import { selectors} from '@playwright/test';


test('Should update the dashboard variable when clicking on map feature', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  gotoDashboardPage,
  selectors,
  context,
  page
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard_e2e.json' });
  const dashboardPage = await gotoDashboardPage(dashboard);
  const geomapPanel = dashboardPage.getByGrafanaSelector("data-testid geomap-panel-container");
  // geomapPanel.locator("canvas");
  // const p = page.waitForTimeout(3000);
  // await p;
  const boundingBox = await geomapPanel.boundingBox();
  await geomapPanel.click({
      position: {
      x: boundingBox!.width / 2,
      y: boundingBox!.height / 2
    }
  });

  const dataLinkTextPanel = dashboardPage.getByGrafanaSelector("data-testid Panel header Datalink test");
  // const p2 = page.waitForTimeout(3000);
  // await p2;
  await expect(dataLinkTextPanel).toContainText(new RegExp("Polygon feature"));

});
