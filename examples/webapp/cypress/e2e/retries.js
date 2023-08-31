let i = 3;
describe("Retries", function () {
  it(
    "Runs a test with retries",
    {
      retries: 3,
    },
    function () {
      throw new Error("x".repeat(1024));
      // if (i > 1) {
      //   i--;
      // }
      // return;
    }
  );
});
