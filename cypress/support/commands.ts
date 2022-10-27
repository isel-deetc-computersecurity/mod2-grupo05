// ***********************************************
// This example commands.js shows you how to
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

import { Challenge } from '../../data/types'

Cypress.Commands.add(
  'expectChallengeSolved',
  (context: { challenge: string }) => {
    cy.request({
      method: 'GET',
      url: '/api/Challenges/?name=' + context.challenge,
      timeout: 60000
    }).then((response) => {
      let challenge: Challenge = response.body.data[0]

      if (!challenge.solved) {
        cy.wait(2000)
        cy.request({
          method: 'GET',
          url: '/api/Challenges/?name=' + context.challenge,
          timeout: 60000
        }).then((secondResponse) => {
          challenge = secondResponse.body.data[0]
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          expect(challenge.solved).to.be.true
        })
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(challenge.solved).to.be.true
      }
    })
  }
)

Cypress.Commands.add(
  'login',
  (context: { email: string, password: string, totpSecret?: string }) => {
    cy.visit('/#/login')
    if (context.email.match(/\S+@\S+\.\S+/)) {
      cy.get('#email').type(context.email)
    } else {
      cy.task('GetFromConfig', 'application.domain').then(
        (appDomain: string) => {
          const email = context.email.concat('@', appDomain)
          cy.get('#email').type(email)
        }
      )
    }
    cy.get('#password').type(context.password)
    cy.get('#loginButton').click()
    cy.wait(500)
  }
)
