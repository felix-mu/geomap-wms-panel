// Source: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
// Object.defineProperty(window, 'matchMedia', {
//     writable: true,
//     value: jest.fn().mockImplementation(query => ({
//       matches: false,
//       media: query,
//       onchange: null,
//       addListener: jest.fn(), // deprecated
//       removeListener: jest.fn(), // deprecated
//       addEventListener: jest.fn(),
//       removeEventListener: jest.fn(),
//       dispatchEvent: jest.fn(),
//     })),
//   });

// Works for mocking API calls
// Object.defineProperty(window, 'fetch', {
//     writable: true,
//     value: jest.fn().mockImplementation((req: URL) => new Promise<void>((resolve, reject) => {
//         resolve();
//     }).then(() => {
//         // let res = new Response("test");
//         // Moking response
//         let res = {
//             text: () => {
//                 return new Promise<void>((resolve, reject) => {
//                     resolve();
//                 }).then(() => {
//                     return 'test';
//                 })
//             }
//         };
//         return res;
//     })
//     )
//   });

import https from "https" ;

Object.defineProperty(window, 'fetch', {
    writable: true,
    value: jest.fn().mockImplementation((req: URL) => new Promise<URL>((resolve, reject) => {
        resolve(req);
    }).then((req) => {
        // let res = new Response("test");
        // Moking response object: https://developer.mozilla.org/en-US/docs/Web/API/Response
        let response = {
            text: () => {
                return new Promise<any>((resolve, reject) => {
                    https.get(req, (res) => {                        
                        res.setEncoding('utf8');
                        let rawData = '';
                        res.on('data', (chunk) => { rawData += chunk; });
                        res.on('end', () => {
                            try {
                                // const parsedData = JSON.parse(rawData);
                                // console.log(parsedData);

                                resolve(rawData);
                            } catch (e) {
                                console.error((e as any).message);
                            }
                        });
                    });
                }).then((data) => {
                    return data;
                })
            }
        };
        return response;
    })
    )
  });
