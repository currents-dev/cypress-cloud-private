describe('Failing test with 2 attempts', () => {
  it('should try 2 times', {
    retries: 2,
  }, () => {
    cy.wrap(false).should('be.true');
  });
});
