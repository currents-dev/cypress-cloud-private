describe("Passed", function () {
  it("should pass", function () {
    cy.visit("/");
    cy.screenshot({
      name: "Customer screenshot",
    });
    expect(true).to.be.true;
  });
});
