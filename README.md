# clerk-cypress

#### A npm package with cypress commands for using clerk.dev

##### Preface

This package is made for cypress 10.3.0 or greater + nextjs 12.2.2 or greater. I can't say if it works in other contexts.

### Installation

#### Step 1 install the npm package

`npm install --save-dev clerk-cypress`

#### Step 2 import the commands

```
// cypress/support/index.js

import 'clerk-cypress';
```

#### Step 3 create a test user

To create a test user simply go through your signup flow. This package currently supports `email-code`, `password` and `phone-code` as authentication strategies.

Make sure the authentication strategy you're trying to use is enabled in the clerk dashboard.

##### Strategy: password

If you're authentication strategy uses password use a test email in the format `xxxxx+clerk_test@xxx.xxx` to avoid sending emails and make the password whatever you want.

Example:

```
email: testuser+clerk_test@test.com
password: 12345678
```

##### Strategy: email-code

If you're authentication strategy uses email-code use the format `xxxxx+clerk_test@xxx.xxx` for the test user email. The `+clerk_test` will tell clerk that it is a test user and let us go through email code verification with the code 424242 every time without sending any emails.

Example email: `testuser+clerk_test@test.com`

See https://clerk.dev/docs/authentication/e2e-testing#email-addresses for more information

##### Strategy: phone-code

If you're authentication strategy uses phone-code use any fictional phone number. This will tell clerk that it is a test user and let us use the verification code 424242 every time like with email code.

See https://clerk.dev/docs/authentication/e2e-testing#phone-numbers for more information

#### Step 3 configure cypress

- Add experimentalSessionAndOrigin: true to e2e, it is required in order to use `cy.session`
- Add `TEST_USER_EMAIL` if you're using email-code.
- Add `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` if you're using password.
- Add `TEST_PHONE_NUMBER` if you're using phone-code.
- If you're using SSR authentication cy.visit('/') will not work and you will need to add `INIT_URL` and make it point to a page in your application that does not use auth or redirect so cypress can grab the window object and set cookies.

TEST_USER_EMAIL, TEST_USER_PASSWORD and TEST_PHONE_NUMBER all define default sign in information which can be overwritten by passing email, password or phone to `cy.signInWithClerk`

```
cy.signInWithClerk({ type: 'email-code', email: 'testuser+clerk_test@test.com', password: '12345678', phoneNumber: '+12015550100' })
```

```
// cypress.config.ts

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalSessionAndOrigin: true,
  },
  env: {
    TEST_USER_EMAIL: "testuser+clerk_test@test.com",
    TEST_USER_PASSWORD: "12345678",
    TEST_PHONE_NUMBER: "+12015550100",
    INIT_URL: "localhost:3000/init"
  },
});

```

### Usage

##### Test client protected page content

```
it("Can see the protected content when signed in", () => {
    cy.signInWithClerk({ type: "email-code" });

    cy.visit("localhost:3000/protected");
    cy.contains("You can only see this if you are signed in");
  });
```

```
it("Can not see the protected content when not signed in", () => {
    cy.signOutOfClerk();

    cy.visit("localhost:3000/protected");
    cy.contains("You can only see this if you are signed out");
  });
```

##### Test SSR protected page

`failOnStatusCode: false` is required when going to SSR protected pages

```
it("Can see SSR protected page when signed in", () => {
    cy.signInWithClerk({ type: "email-code" });

    cy.visit("localhost:3000/protected-ssr", { failOnStatusCode: false });
    cy.contains("This is protected by server side rendering");
  });
```

```
it("Returns 401 when signed out", () => {
  cy.signOutOfClerk();

  cy.request({
    url: "localhost:3000/protected-ssr",
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(401);
  });
});
```

```
  it("Can not see SSR protected page when signed out and is redirected to sign-in page", () => {
    cy.signOutOfClerk();

    cy.visit("localhost:3000/protected-ssr", { failOnStatusCode: false });
    cy.contains("This is the sign-in page");
  });
```

Example repo https://github.com/pcnbj/next-clerk-cypress-example
