import { EmailCodeFactor } from '@clerk/types';

interface SignInWithEmailCodeArgs {
  email?: string;
}

export const signInWithEmailCode = ({ email }: SignInWithEmailCodeArgs) => {
  cy.window()
    .should(window => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async window => {
      if (window.Clerk && window.Clerk.client) {
        cy.clearCookies({ domain: null });

        const emailAddress: string = email || Cypress.env(`TEST_USER_EMAIL`);

        await window.Clerk.signOut();

        const signInResp = await window.Clerk.client.signIn.create({
          identifier: emailAddress,
          strategy: 'email_code',
        });

        const { emailAddressId } = signInResp?.supportedFirstFactors.find(
          ff => {
            if (ff.strategy === 'email_code') {
              const firstFactor = ff as EmailCodeFactor;

              if (firstFactor.safeIdentifier === emailAddress) {
                return true;
              }
            }

            return false;
          }
        )! as EmailCodeFactor;

        await window.Clerk.client.signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId: emailAddressId,
        });

        const attemptResponse = await window.Clerk.client.signIn.attemptFirstFactor(
          {
            strategy: 'email_code',
            code: '424242',
          }
        );

        await window.Clerk.setActive({
          session: attemptResponse.createdSessionId,
        });

        if (attemptResponse.status == 'complete') {
          console.log('Sign in success');
        } else {
          console.log('Sign in failed');
        }
      }
    });
};
