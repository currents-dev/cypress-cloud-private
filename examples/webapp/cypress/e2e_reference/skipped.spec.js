describe("Skipped", function () {
  beforeEach(function () {
    throw new Error("before each exception");
  });
  it("should not be skipped", function () {
    expect(true).to.be.true;
  });
  it("should be skipped", function () {
    expect(true).to.be.true;
  });
});
