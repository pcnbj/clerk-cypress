import { SignInWithClerkArgs } from '../../../types';
import { signInWithEmailCode } from './signInWithEmailCode';

Cypress.Commands.add(`signInWithClerk`, args => {
  cy.log(`Signing in with clerk.`);

  cy.session('signIn', () => {
    signInWithClerk(args);
  });
});

const signInWithClerk = ({ type }: SignInWithClerkArgs) => {
  cy.visit(`localhost:3000/init`, { failOnStatusCode: false });

  if (type === 'email-code') {
    signInWithEmailCode();
  }
};
