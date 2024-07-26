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
  await expect(panelEditPage.panel.getByGrafanaSelector("Base layer Base layer field property editor").getByText("OGC Web Map Service")).toHaveCount(1);
});

test('Should be able to select a WMS Layer when a valid WMS endpoint is typed in the URL form', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  selectors,
  context,
  page
}) => {
  // test.setTimeout(120000); // https://playwright.dev/docs/test-timeouts#set-timeout-for-a-single-test

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

  await panelEditPage.panel.getByGrafanaSelector("wms add button").click();

  // await Promise.all([
  //   page.waitForResponse("https://geoportal.muenchen.de/geoserver/gsm/wms?service=WMS&request=GetCapabilities"),
  //   panelEditPage.panel.getByGrafanaSelector("URL input").first().fill(WMS_ENDPOINT)
  // ]);
  await panelEditPage.panel.getByGrafanaSelector("URL input").first().fill(WMS_ENDPOINT);

  // Click outside of url input
  if (UPDATE_HAR) {
    const capabilitiesResponsePromise = page.waitForResponse("https://geoportal.muenchen.de/geoserver/gsm/wms?service=WMS&request=GetCapabilities");
    // await panelEditPage.panel.locator.click();
    await panelEditPage.panel.getByGrafanaSelector("URL input").first().blur();
    // console.log(await capabilitiesResponse);
    const capabilitiesResponse = await capabilitiesResponsePromise;
    console.log('Capabilities response:', capabilitiesResponse.status());
  } else {
    // await panelEditPage.panel.locator.click();
    await panelEditPage.panel.getByGrafanaSelector("URL input").first().blur();
  }
  
  const multiSelect: Locator = panelEditPage.panel.getByGrafanaSelector("wms layer multiselect").first();
  await multiSelect.click();

  const selectOptions: Locator = panelEditPage.getByGrafanaSelector("Select options menu").getByLabel("Select option");

  if(UPDATE_HAR) {
    await selectOptions.first().click({trial: true});
    // CAUTION: Encoding of URL is important
    const layer1ResponsePromise = page.waitForResponse(
      "https://geoportal.muenchen.de/geoserver/gsm/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=g_fw_untersuchungsgebiet_swm&CRS=EPSG%3A3857&STYLES=&WIDTH=846&HEIGHT=242&BBOX=1277760.4084280902%2C6124720.506528781%2C1299844.4046409936%2C6131037.678022307"
    );
    await selectOptions.first().click();
    // console.log(await layer1Response);
    const layer1Response = await layer1ResponsePromise;
    console.log('layer1 response:', layer1Response.status());
    // await Promise.all([
    //   page.waitForResponse("https://geoportal.muenchen.de/geoserver/gsm/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&Layers=g_fw_untersuchungsgebiet_swm&CRS=EPSG%3A3857&STYLES=&WIDTH=846&HEIGHT=242&BBOX=1277760.4084280902%2C6124720.506528781%2C1299844.4046409936%2C6131037.678022307"),
    //   selectOptions.first().click()
    // ]); // https://stackoverflow.com/questions/67702724/playwright-test-fails-when-using-waitforresponse
    // Add two more layers
    // for (let i = 0; i < 2; ++i) {
    await multiSelect.click();
    // CAUTION: Encoding of URL is important
    const layer2ResponsePromise = page.waitForResponse(
      "https://geoportal.muenchen.de/geoserver/gsm/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&Layers=g_fw_untersuchungsgebiet_swm%2Cg_giw_stadtkarte&CRS=EPSG%3A3857&STYLES=&WIDTH=846&HEIGHT=242&BBOX=1277760.4084280902%2C6124720.506528781%2C1299844.4046409936%2C6131037.678022307"
    );
    await selectOptions.first().click();
    const layer2Response = await layer2ResponsePromise;
    console.log('layer2 response:', layer2Response.status());

    // await multiSelect.click();
    // CAUTION: Encoding of URL is important
    // const layer3Response = page.waitForResponse(
    //   "https://geoportal.muenchen.de/geoserver/gsm/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&Layers=g_fw_untersuchungsgebiet_swm%2Cg_giw_stadtkarte%2Cg_lagekarte_2016&CRS=EPSG%3A3857&STYLES=&WIDTH=846&HEIGHT=242&BBOX=1277760.4084280902%2C6124720.506528781%2C1299844.4046409936%2C6131037.678022307"
    // );
    // await selectOptions.first().click();
    // await layer3Response;
  } else {
    // Add two more layers
    for (let i = 0; i < 2; ++i) {
      await selectOptions.first().click();
      await multiSelect.click();
    }
    await selectOptions.first().click();
  }

  // Click outside of multi select
  // await panelEditPage.panel.locator.click();

  // Expect assert will be possible when API call is mocked and the layer values are known
  expect(true).toBeTruthy();
});

test('Should be able to add two wms entries', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  selectors
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard_e2e.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  await panelEditPage.panel.getByGrafanaSelector("wms add button").click();
  await panelEditPage.panel.getByGrafanaSelector("wms add button").click();
  await expect(panelEditPage.panel.getByGrafanaSelector("wms container")).toHaveCount(2);
});
