describe('Home', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')

    cy.matchImageSnapshot()
  })
})