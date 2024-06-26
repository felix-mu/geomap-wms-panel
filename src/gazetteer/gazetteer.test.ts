import { getGazetteer } from './gazetteer';

let backendResults: any = { hello: 'world' };
import countriesJSON from './countries.json';

jest.mock('@grafana/runtime', () => ({
  ...(jest.requireActual('@grafana/runtime') as unknown as object),
  getBackendSrv: () => ({
    get: jest.fn().mockResolvedValue(backendResults),
  }),
}));

describe('Placename lookups', () => {
  beforeEach(() => {
    backendResults = { hello: 'world' };
  });

  it('unified worldmap config', async () => {
    backendResults = countriesJSON;
    const gaz = await getGazetteer('countries');
    expect(gaz.error).toBeUndefined();
    expect(gaz.find('US')).toMatchInlineSnapshot(`
      {
        "coords": [
          -95.712891,
          37.09024,
        ],
        "props": {
          "name": "United States",
        },
      }
    `);
    // Items with 'keys' should get allow looking them up
    expect(gaz.find('US')).toEqual(gaz.find('USA'));
  });
});
