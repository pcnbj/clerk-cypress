import { Clerk, Strate } from '@clerk/types';

interface IClearCookies {
  domain?: string | null;
}

export interface SignInWithClerkArgs {
  strategy: 'email-code' | 'phone-code' | 'password';
  email?: string;
  password?: string;
  phoneNumber?: string;
}

declare global {
  namespace Cypress {
    export interface Chainable<Subject = any> {
      /**
       * Sign in to clerk with Cypress.env('TEST_USER').
       * @example cy.signIn({ type: 'email-code' })
       */
      signInWithClerk(args: SignInWithClerkArgs): Chainable<void>;
      /**
       * Sign out of clerk.
       * @example cy.signOut()
       */
      signOutOfClerk(): Chainable<void>;
      clearCookies(
        options?:
          | Partial<Cypress.Loggable & Cypress.Timeoutable>
          | IClearCookies
          | undefined
      ): Cypress.Chainable<null>;
    }
  }
  interface Window {
    Clerk: Clerk;
  }
}

export {};
