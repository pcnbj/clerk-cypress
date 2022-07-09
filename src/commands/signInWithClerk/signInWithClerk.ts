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
  strategy,
  email,
  password,
  phoneNumber,
}: SignInWithClerkArgs) => {
  cy.visit(Cypress.env('INIT_URL') || `/`, {
    failOnStatusCode: false,
  });

  if (strategy === 'email-code') {
    signInWithEmailCode({ email });
  }
  if (strategy === 'phone-code') {
    signInWithPhone({ phoneNumber });
  }
  if (strategy === 'password') {
    signInWithEmailAndPassword({ email, password });
  }
};
