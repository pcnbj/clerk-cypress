import { PhoneCodeFactor, SignInCreateParams } from '@clerk/types';

interface SignInWithPhoneArgs {
  phoneNumber?: string;
}

export const signInWithPhone = ({ phoneNumber }: SignInWithPhoneArgs) => {
  cy.window()
    .should(window => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async window => {
      if (window.Clerk && window.Clerk.client) {
        cy.clearCookies({ domain: null });

        const params: SignInCreateParams = {
          identifier: phoneNumber || Cypress.env(`TEST_PHONE_NUMBER`),
          strategy: 'phone_code',
        };

        const signInResp = await window.Clerk.client.signIn.create(params);

        const { phoneNumberId } = signInResp?.supportedFirstFactors.find(ff => {
          if (ff.strategy === 'phone_code') {
            const firstFactor = ff as PhoneCodeFactor;

            if (firstFactor.safeIdentifier === phoneNumber) {
              return true;
            }
          }

          return false;
        })! as PhoneCodeFactor;

        await window.Clerk.client.signIn.prepareFirstFactor({
          phoneNumberId,
          strategy: 'phone_code',
        });

        const attemptResponse = await window.Clerk.client.signUp.attemptPhoneNumberVerification(
          {
            code: '424242',
          }
        );

        if (attemptResponse.status == 'complete') {
          console.log('Sign in success');
        } else {
          console.log('Sign in failed');
        }
      }
    });
};
