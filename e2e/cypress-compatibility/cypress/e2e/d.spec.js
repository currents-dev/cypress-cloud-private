describe('Passed test with screenshot, passed test with no screenshots', () => {
  it('should assert and take a screenshot', () => {
    // Assert that true is true
    cy.wrap(true).should('be.true');

    // Take a screenshot
    cy.screenshot('internal-assert-screenshot');
  });

  it('should assert that true is true', () => {
    cy.wrap(true).should('be.true');
  });
});
