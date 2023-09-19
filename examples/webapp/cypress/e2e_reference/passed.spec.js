describe("Passed", function () {
  it("should pass", function () {
    cy.visit("/");
    cy.screenshot("custom-screenshot");
    expect(true).to.be.true;
  });
});
