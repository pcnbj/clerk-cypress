interface IClearCookies {
  domain?: string | null;
}

export interface SignInWithClerkArgs {
  type: 'email-code';
}

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Sign in to clerk with Cypress.env('TEST_USER').
       * Sign in with email code example
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
}

export {};
