import { test, expect, DashboardPage } from '@grafana/plugin-e2e';
import { wmsEndpoint } from './test_config';
import { Locator } from '@playwright/test';
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
  selectors
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard_e2e.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  // const showTableHeaderSwitch = panelEditPage
  //   .getByGrafanaSelector(selectors.components.PanelEditor.OptionsPane.fieldLabel('Table Show table header'))
  //   .getByLabel('Toggle switch');
  // selectors.setTestIdAttribute("aria-label");
  await panelEditPage.panel.getByGrafanaSelector("URL input").fill(wmsEndpoint);
  
  const multiSelect: Locator = panelEditPage.panel.getByGrafanaSelector("wms layer multiselect");
  await multiSelect.click();

  setTimeout(() => {}, 3000);

  const selectOptions: Locator = panelEditPage.getByGrafanaSelector("Select options menu").getByLabel("Select option");
  await selectOptions.first().click();

  // Add two more layers
  for (let i = 0; i < 2; ++i) {
    await multiSelect.click();
    await selectOptions.first().click();
  }

  // Click outside of multi select
  await panelEditPage.panel.locator.click();

  // Expect assert will be possible when API call is mocked and the layer values are known
});

test('Should toggle the spatial filter tool', async ({
  gotoPanelEditPage,
  gotoDashboardPage,
  readProvisionedDashboard,
  selectors,
  page
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard_e2e.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  const spatialFilterToolToggle = panelEditPage.getByGrafanaSelector(
    'Map controls Show spatial filter tool field property editor'
  ).getByLabel('Toggle switch');
  await spatialFilterToolToggle.click();

  await panelEditPage.getByGrafanaSelector("data-testid Apply changes and go back to dashboard").click();

  await expect(page.getByLabel('spatial filter tool button')).toBeVisible();
});

test('Using the spatial filter tool should alter the "geomap_wms_spatial_filter_geometry" variable', async ({
  gotoPanelEditPage,
  gotoDashboardPage,
  readProvisionedDashboard,
  selectors,
  page
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard_e2e.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  const spatialFilterToolToggle = panelEditPage.getByGrafanaSelector(
    'Map controls Show spatial filter tool field property editor'
  ).getByLabel('Toggle switch');
  await spatialFilterToolToggle.click();

  await panelEditPage.getByGrafanaSelector("data-testid Apply changes and go back to dashboard").click();

  await page.getByLabel('spatial filter tool button').click();
  
  // console.log(selectors.pages.Dashboard.Settings.Variables.List.url(dashboard.uid));

  let geomapContainer: Locator = page.getByTestId("data-testid geomap-panel-container");
  const boundingBox = await geomapContainer.boundingBox();

  if (boundingBox === undefined || boundingBox == null) {
    throw Error("Geomap panel container is not visible. See https://playwright.dev/docs/api/class-locator#locator-bounding-box");
  }

  console.log(boundingBox);

  const urlBefore: string = page.url();

  // Draw triangle
  await geomapContainer.click({
    button: "left",
    position: {
      x: Math.round(boundingBox.width * 0.5),
      y: Math.round(boundingBox.height * 0.8)
    }
  });

  await geomapContainer.click({
    button: "left",
    position: {
      x: Math.round(boundingBox.width * 0.25),
      y: Math.round(boundingBox.height * 0.2)
    }
  });

  await geomapContainer.click({
    button: "left",
    position: {
      x: Math.round(boundingBox.width * 0.75),
      y: Math.round(boundingBox.height * 0.2)
    }
  });

  await geomapContainer.click({
    button: "left",
    position: {
      x: Math.round(boundingBox.width * 0.5),
      y: Math.round(boundingBox.height * 0.8)
    }
  });

  expect(page.url()).not.toEqual(urlBefore);

});
