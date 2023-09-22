let attempt = 0;
describe('Failing test with 2 attempts, passed test and flaky test with 2 attempts', () => {
  it('should try 2 times', {
    retries: 2,
  }, () => {
    cy.wrap(false).should('be.true');
  });

  it('should assert that true is true', () => {
    cy.wrap(true).should('be.true');
  });

  it('should fail on the first attempt and pass on the second', { retries: 2 }, () => {
    if (attempt === 0) {
      attempt++;
      cy.wrap(false).should('be.true');  // This will fail on the first attempt
    } else {
      cy.wrap(true).should('be.true');   // This will pass on the second attempt
    }
  });
});
