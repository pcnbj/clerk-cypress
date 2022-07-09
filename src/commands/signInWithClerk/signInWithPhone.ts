import { PhoneCodeFactor } from '@clerk/types';

interface SignInWithPhoneArgs {
  phone?: string;
}

export const signInWithPhone = ({ phone }: SignInWithPhoneArgs) => {
  cy.window()
    .should(window => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async window => {
      if (window.Clerk && window.Clerk.client) {
        cy.clearCookies({ domain: null });

        const phoneNumber: string = phone || Cypress.env(`TEST_PHONE_NUMBER`);

        const signInResp = await window.Clerk.client.signIn.create({
          identifier: phoneNumber,
          strategy: 'phone_code',
        });

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
