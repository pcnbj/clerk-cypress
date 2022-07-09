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

        await window.Clerk.client.signUp.create({
          phoneNumber,
        });

        await window.Clerk.client.signUp.preparePhoneNumberVerification();

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
