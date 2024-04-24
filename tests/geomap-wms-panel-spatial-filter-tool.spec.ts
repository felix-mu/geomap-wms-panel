import { test, expect, DashboardPage } from '@grafana/plugin-e2e';
import { WMS_ENDPOINT } from './test_config';
import { Locator } from '@playwright/test';
// import { selectors} from '@playwright/test';

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

  await geomapContainer.focus();

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

  // await page.waitForTimeout(1000);

  await page.getByTitle("Geomap WMS Panel").click();

  expect(page.url()).not.toEqual(urlBefore);

});
