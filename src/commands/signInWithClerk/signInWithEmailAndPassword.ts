import { SignInCreateParams } from '@clerk/types';

interface SignInWithEmailAndPasswordArgs {
  email?: string;
  password?: string;
}

export const signInWithEmailAndPassword = ({
  email,
  password,
}: SignInWithEmailAndPasswordArgs) => {
  cy.window()
    .should(window => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async window => {
      if (window.Clerk && window.Clerk.client) {
        cy.clearCookies({ domain: null });

        const params: SignInCreateParams = {
          identifier: email || Cypress.env(`TEST_USER_EMAIL`),
          password: password || Cypress.env(`TEST_USER_PASSWORD`),
        };

        const attemptResponse = await window.Clerk.client.signIn.create(params);

        if (attemptResponse.status == 'complete') {
          console.log('Sign in success');
        } else {
          console.log('Sign in failed');
        }
      }
    });
};
