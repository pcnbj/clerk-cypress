export const signInWithEmailCode = () => {
  cy.window()
    .should((window: any) => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async (window: any) => {
      cy.clearCookies({ domain: null });

      const emailAddress = Cypress.env(`TEST_USER`);

      await window.Clerk.signOut();

      const signInResp = await window.Clerk.client.signIn.create({
        identifier: emailAddress,
      });

      const { emailAddressId } = signInResp.supportedFirstFactors.find(
        (ff: any) =>
          ff.strategy === 'email_code' && ff.safeIdentifier === emailAddress
      )! as any;

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
    });
};
