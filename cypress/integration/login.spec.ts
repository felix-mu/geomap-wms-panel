import { e2e } from '@grafana/e2e';

// describe('My First Test', () => {
//   it('Visits grafana login page', () => {
//     cy.visit('http://localhost:3000');
//   })
// });

// e2e.scenario({
//     describeName: 'Smoke test',
//     itName: 'Smoke test',
//     scenario: () => {
//       e2e.pages.Home.visit();
//       e2e().contains('Welcome to Grafana').should('be.visible');
//     },
//   });

// Flows: https://github.com/grafana/grafana/blob/main/packages/grafana-e2e/src/flows

describe('Dummy test to login', () => {
    it('Accessing localhost and logging in', () => {
        // e2e.pages.Login.visit();
        // e2e.pages.Login.username().should('be.visible').type('admin');
        e2e.flows.login();
    });
  });


