Cypress.Commands.add(`signOutOfClerk`, () => {
  cy.log(`Signing out of clerk.`);
  cy.clearCookies({ domain: null });
});
