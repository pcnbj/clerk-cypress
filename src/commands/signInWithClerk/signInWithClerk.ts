import { SignInWithClerkArgs } from '../../../types';
import { signInWithEmailAndPassword } from './signInWithEmailAndPassword';
import { signInWithEmailCode } from './signInWithEmailCode';
import { signInWithPhone } from './signInWithPhone';

Cypress.Commands.add(`signInWithClerk`, args => {
  cy.log(`Signing in with clerk.`);

  const sessionName = getSessionName(args);

  cy.session(sessionName, () => {
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

const getSessionName = ({
  strategy,
  email,
  phoneNumber,
}: SignInWithClerkArgs) => {
  if (strategy === 'email-code') {
    return `signIn__${email}`;
  }
  if (strategy === 'phone-code') {
    return `signIn__${phoneNumber}`;
  }
  if (strategy === 'password') {
    return `signIn__${email}`;
  }

  return 'signIn';
};
