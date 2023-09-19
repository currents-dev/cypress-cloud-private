import fs from "fff";

describe("Crashing test", function () {
  it("should crash", () => {
    fs.writeFileSync("test.txt", "Hello World!");
    expect(true).to.be.true;
  });
});
