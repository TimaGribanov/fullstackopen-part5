describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'tester-cypress', password: 'testing-cy', name: 'Tester Cypress'
    })
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('log in').click()
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()

      cy.get('#username').type('tester-cypress')
      cy.get('#password').type('testing-cy')
      cy.get('#login-button').click()

      cy.contains('Tester Cypress logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()

      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.err')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})