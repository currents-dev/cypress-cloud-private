describe("Example spec", () => {
  beforeEach(() => {
    console.log("beforeEach");
  });
  afterEach(() => {
    console.log("after");
  });
  it("should open a page", () => {
    cy.visit("https://launchdarkly.com/");
    cy.get("a").contains("Get started").should("be.visible");
  });
});
