import "@testing-library/cypress/add-commands";

/// <reference types="cypress" />

// @ts-ignore
Cypress.Commands.add("assertLoggedIn", () => {
  cy.window().its("localStorage.uber-token").should("be.a", "string");
});

// @ts-ignore
Cypress.Commands.add("assertLoggedOut", () => {
  cy.window().its("localStorage.uber-token").should("be.null");
});

// @ts-ignore
Cypress.Commands.add("login", (email, password) => {
  // @ts-ignore
  cy.assertLoggedOut();
  cy.visit("/");
  cy.findByPlaceholderText(/email/i).type("vanquishr@daum.net");
  cy.findByPlaceholderText(/password/i).type("1234");
  cy.findByRole("button")
    .should("not.have.class", "pointer-events-none")
    .click();
  // @ts-ignore
  cy.assertLoggedIn();
});

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
