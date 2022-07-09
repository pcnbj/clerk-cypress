import { SignInWithClerkArgs } from '../../../types';
import { signInWithEmailAndPassword } from './signInWithEmailAndPassword';
import { signInWithEmailCode } from './signInWithEmailCode';
import { signInWithPhone } from './signInWithPhone';

Cypress.Commands.add(`signInWithClerk`, args => {
  cy.log(`Signing in with clerk.`);

  cy.session('signIn', () => {
    signInWithClerk(args);
  });
});

const signInWithClerk = ({
  type,
  email,
  password,
  phone,
}: SignInWithClerkArgs) => {
  cy.visit(Cypress.env('INIT_URL') || `/`, {
    failOnStatusCode: false,
  });

  if (type === 'email-code') {
    signInWithEmailCode({ email });
  }
  if (type === 'phone') {
    signInWithPhone({ phone });
  }
  if (type === 'email-password') {
    signInWithEmailAndPassword({ email, password });
  }
};
