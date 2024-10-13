import { test, expect, DashboardPage } from '@grafana/plugin-e2e';
import { WMS_ENDPOINT, HAR_FILEPATH, UPDATE_HAR } from './test_config';
import { Locator } from '@playwright/test';

test('Should be able to toggle the legend for WMS layers when a valid WMS endpoint is typed in the URL form', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
  selectors,
  context,
  page
}) => {
  // test.setTimeout(120000); // https://playwright.dev/docs/test-timeouts#set-timeout-for-a-single-test

  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard_e2e.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });

  await context.routeFromHAR(HAR_FILEPATH, {
    update: UPDATE_HAR,
    url: "https://geoportal.muenchen.de/geoserver/gsm/*"
  }); // https://playwright.dev/docs/mock#replaying-from-har

  await panelEditPage.panel.getByGrafanaSelector("wms add button").click();

  // await Promise.all([
  //   page.waitForResponse("https://geoportal.muenchen.de/geoserver/gsm/wms?service=WMS&request=GetCapabilities"),
  //   panelEditPage.panel.getByGrafanaSelector("URL input").first().fill(WMS_ENDPOINT)
  // ]);
  await panelEditPage.panel.getByGrafanaSelector("URL input").fill(WMS_ENDPOINT);

  // Click outside of url input
  if (UPDATE_HAR) {
    const capabilitiesResponsePromise = page.waitForResponse("https://geoportal.muenchen.de/geoserver/gsm/wms?service=WMS&request=GetCapabilities");
    // await panelEditPage.panel.locator.click();
    await panelEditPage.panel.getByGrafanaSelector("URL input").blur();
    // console.log(await capabilitiesResponse);
    const capabilitiesResponse = await capabilitiesResponsePromise;
    console.log('Capabilities response:', capabilitiesResponse.status());
  } else {
    // await panelEditPage.panel.locator.click();
    await panelEditPage.panel.getByGrafanaSelector("URL input").blur();
  }
  
  const multiSelect: Locator = panelEditPage.panel.getByGrafanaSelector("wms layer multiselect").first();
  await multiSelect.click();

   let selectOptions: Locator = panelEditPage.getByGrafanaSelector("Select options menu").getByLabel("Select option");
   if (await selectOptions.count() == 0) {
    // Instead of aria label try data-testid Select option
    selectOptions = panelEditPage.getByGrafanaSelector("data-testid Select option");
  }
  if(UPDATE_HAR) {
    // await selectOptions.first().click({trial: true});
    // CAUTION: Encoding of URL is important
    const layer1ResponsePromise = page.waitForResponse(
      // Might not work because URL might differ from hard coded one "https://geoportal.muenchen.de/geoserver/gsm/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=g_fw_untersuchungsgebiet_swm&CRS=EPSG%3A3857&STYLES=&WIDTH=846&HEIGHT=242&BBOX=1277760.4084280902%2C6124720.506528781%2C1299844.4046409936%2C6131037.678022307"
      response => response.status() === 200
    );
    await selectOptions.first().click();
    const layer1Response = await layer1ResponsePromise;
    console.log('layer1 response:', layer1Response.status());
    // await Promise.all([
    //   page.waitForResponse("https://geoportal.muenchen.de/geoserver/gsm/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&Layers=g_fw_untersuchungsgebiet_swm&CRS=EPSG%3A3857&STYLES=&WIDTH=846&HEIGHT=242&BBOX=1277760.4084280902%2C6124720.506528781%2C1299844.4046409936%2C6131037.678022307"),
    //   selectOptions.first().click(),
    // ]); // https://stackoverflow.com/questions/67702724/playwright-test-fails-when-using-waitforresponse
    // await multiSelect.blur();

    // Add two more layers
    // for (let i = 0; i < 2; ++i) {
    await multiSelect.click();
    // CAUTION: Encoding of URL is important
    const layer2ResponsePromise = page.waitForResponse(
      response =>
        response.status() === 200
    );
    await selectOptions.last().click();
    await multiSelect.blur();
    const layer2Response = await layer2ResponsePromise;
    console.log('layer2 response:', layer2Response.status());

    await multiSelect.click();
    // CAUTION: Encoding of URL is important
    const layer3Response = page.waitForResponse(
      response => response.status() === 200
    );
    await selectOptions.first().click();
    await layer3Response;
  } else {
    // Add two more layers
    for (let i = 0; i < 2; ++i) {
      await selectOptions.first().click();
      await multiSelect.blur();
      await multiSelect.click();
    }
    await selectOptions.first().click();
  }

  // Toggle the wms legend for the first wms layer
  const legendToggleSwitch = panelEditPage.getByGrafanaSelector("wms layer legend toggle switch").getByLabel("Toggle switch");
  // if(UPDATE_HAR) {
  //   // await selectOptions.first().click({trial: true});
  //   // CAUTION: Encoding of URL is important
  //   const legendEntries = page.waitForResponse(
  //     // Might not work because URL might differ from hard coded one "https://geoportal.muenchen.de/geoserver/gsm/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=g_fw_untersuchungsgebiet_swm&CRS=EPSG%3A3857&STYLES=&WIDTH=846&HEIGHT=242&BBOX=1277760.4084280902%2C6124720.506528781%2C1299844.4046409936%2C6131037.678022307"
  //     response => response.status() === 200
  //   );
  //   const legendEntriesResponse = await legendEntries;
  //   console.log('legendEntriesResponse response:', legendEntriesResponse.status());
  // } else {
  //   await legendToggleSwitch.first().click();
  // }
  await legendToggleSwitch.first().click();
  await panelEditPage.getByGrafanaSelector("wms legend collapse button").click();

  const legendItemsContainers = panelEditPage.getByGrafanaSelector("wms legend container").getByLabel(new RegExp("wms legend image container.*", "i"));

  console.log(`Number of wms legend image containers: ${await legendItemsContainers.count()}`);

  await expect(legendItemsContainers).toHaveCount(3);
});

