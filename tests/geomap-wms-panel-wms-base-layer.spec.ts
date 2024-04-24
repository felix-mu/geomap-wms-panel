import { test, expect, DashboardPage } from '@grafana/plugin-e2e';
import { WMS_ENDPOINT, HAR_FILEPATH, UPDATE_HAR } from './test_config';
import { Locator } from '@playwright/test';
import { update } from 'lodash';
// import { selectors} from '@playwright/test';

test('Should have the base map layer type "OGC Web Map Service" selected', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  selectors
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard_e2e.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  // const showTableHeaderSwitch = panelEditPage
  //   .getByGrafanaSelector(selectors.components.PanelEditor.OptionsPane.fieldLabel('Table Show table header'))
  //   .getByLabel('Toggle switch');
  // selectors.setTestIdAttribute("aria-label");
  expect(panelEditPage.panel.getByGrafanaSelector("Base layer Base layer field property editor").getByText("OGC Web Map Service")).toHaveCount(1);
});

test('Should be able to select a WMS Layer when a valid WMS endpoint is typed in the URL form', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  selectors,
  context
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard_e2e.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  // const showTableHeaderSwitch = panelEditPage
  //   .getByGrafanaSelector(selectors.components.PanelEditor.OptionsPane.fieldLabel('Table Show table header'))
  //   .getByLabel('Toggle switch');
  // selectors.setTestIdAttribute("aria-label");
  await panelEditPage.panel.getByGrafanaSelector("URL input").fill(WMS_ENDPOINT);

  // Click outside of multi select
  await panelEditPage.panel.locator.click();

  setTimeout(() => {}, 3000);

  await context.routeFromHAR(HAR_FILEPATH, {update: UPDATE_HAR});
  
  const multiSelect: Locator = panelEditPage.panel.getByGrafanaSelector("wms layer multiselect");
  await multiSelect.click();

  const selectOptions: Locator = panelEditPage.getByGrafanaSelector("Select options menu").getByLabel("Select option");
  await selectOptions.first().click();

  setTimeout(() => {}, 3000);

  // Add two more layers
  for (let i = 0; i < 2; ++i) {
    await multiSelect.click();
    await selectOptions.first().click();

    setTimeout(() => {}, 3000);
  }

  // Click outside of multi select
  await panelEditPage.panel.locator.click();

  // Expect assert will be possible when API call is mocked and the layer values are known
});