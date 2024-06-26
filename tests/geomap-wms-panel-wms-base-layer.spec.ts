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
  context,
  page
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard_e2e.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  // const showTableHeaderSwitch = panelEditPage
  //   .getByGrafanaSelector(selectors.components.PanelEditor.OptionsPane.fieldLabel('Table Show table header'))
  //   .getByLabel('Toggle switch');
  // selectors.setTestIdAttribute("aria-label");

  // test.setTimeout(120000);

  await context.routeFromHAR(HAR_FILEPATH, {
    update: UPDATE_HAR,
    url: "https://geoportal.muenchen.de/geoserver/gsm/*"
  }); // https://playwright.dev/docs/mock#replaying-from-har

  await panelEditPage.panel.getByGrafanaSelector("URL input").fill(WMS_ENDPOINT);

  // Click outside of multi select
  if (UPDATE_HAR) {
    const capabilitiesResponse = page.waitForResponse("https://geoportal.muenchen.de/geoserver/gsm/wms?service=WMS&request=GetCapabilities");
    await panelEditPage.panel.locator.click();
    console.log(await capabilitiesResponse);
  } else {
    await panelEditPage.panel.locator.click();
  }
  
  const multiSelect: Locator = panelEditPage.panel.getByGrafanaSelector("wms layer multiselect");
  await multiSelect.click();

  const selectOptions: Locator = panelEditPage.getByGrafanaSelector("Select options menu").getByLabel("Select option");

  if(UPDATE_HAR) {
    // CAUTION: Encoding of URL is important
    const layer1Response =  page.waitForResponse("https://geoportal.muenchen.de/geoserver/gsm/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&Layers=g_fw_untersuchungsgebiet_swm&CRS=EPSG%3A3857&STYLES=&WIDTH=846&HEIGHT=242&BBOX=1277760.4084280902%2C6124720.506528781%2C1299844.4046409936%2C6131037.678022307");
    await selectOptions.first().click();
    console.log(await layer1Response);
    // await page.waitForTimeout(5000);

    // Add two more layers
    // for (let i = 0; i < 2; ++i) {
    await multiSelect.click();
    // CAUTION: Encoding of URL is important
    const layer2Response = page.waitForResponse("https://geoportal.muenchen.de/geoserver/gsm/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&Layers=g_fw_untersuchungsgebiet_swm%2Cg_giw_stadtkarte&CRS=EPSG%3A3857&STYLES=&WIDTH=846&HEIGHT=242&BBOX=1277760.4084280902%2C6124720.506528781%2C1299844.4046409936%2C6131037.678022307");
    await selectOptions.first().click();
    console.log(await layer2Response);

    await multiSelect.click();
    // CAUTION: Encoding of URL is important
    const layer3Response = page.waitForResponse("https://geoportal.muenchen.de/geoserver/gsm/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&Layers=g_fw_untersuchungsgebiet_swm%2Cg_giw_stadtkarte%2Cg_lagekarte_2016&CRS=EPSG%3A3857&STYLES=&WIDTH=846&HEIGHT=242&BBOX=1277760.4084280902%2C6124720.506528781%2C1299844.4046409936%2C6131037.678022307");
    await selectOptions.first().click();
    await layer3Response;
  } else {
    // Add two more layers
    for (let i = 0; i < 2; ++i) {
      await selectOptions.first().click();
      await multiSelect.click();
    }
    await selectOptions.first().click();
  }

  // Click outside of multi select
  await panelEditPage.panel.locator.click();

  // Expect assert will be possible when API call is mocked and the layer values are known
});
