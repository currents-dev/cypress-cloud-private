describe('Ignored test', () => {
  it.skip('should be a skipped test', () => {
    cy.wrap(false).should('be.true');
  });
});
