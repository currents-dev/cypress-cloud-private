import { warn } from "@currents/cc-est/lib/log";
import { Event, getPubSub } from "@currents/cc-est/lib/pubsub";
import { describe, expect, it } from "@jest/globals";
import { random } from "lodash";
import { runTillDoneOrCancelled } from "../cancellable";
import { runTillDone } from "../runner";

jest.mock("../runner", () => ({
  runTillDone: jest.fn().mockResolvedValue({}),
}));
jest.mock("@currents/cc-est/lib/log", () => ({
  warn: jest.fn(),
}));

jest.spyOn(console, "warn");

describe("runTillDoneOrCancelled", () => {
  let result: any = null;

  beforeEach(() => {
    jest.resetAllMocks();
    result = null;
  });

  it("resolves when runTillDone resolves", async () => {
    const _result = random(1, 100);
    (runTillDone as jest.Mock).mockImplementationOnce(async () => {
      result = _result;
    });
    // @ts-expect-error
    await runTillDoneOrCancelled({});
    expect(runTillDone).toHaveBeenCalled();
    expect(result).toEqual(_result);
    expect(getPubSub().listeners(Event.RUN_CANCELLED)).toHaveLength(0);
  });

  it("rejects when runTillDone rejects", async () => {
    (runTillDone as jest.Mock).mockRejectedValue(
      new Error("runTillDone error")
    );
    // @ts-expect-error
    await expect(runTillDoneOrCancelled()).rejects.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getPubSub().listeners(Event.RUN_CANCELLED)).toHaveLength(0);
  });

  it("cancels the run when the RUN_CANCELLED event is emitted", async () => {
    const cancelReason = "Test cancel reason";

    // define a long-running task
    (runTillDone as jest.Mock).mockImplementation(() => {
      return new Promise((_resolve, _reject) => {
        setTimeout(() => {
          _resolve("whatever");
        }, 2000);
      });
    });

    // schedule firing the event
    setTimeout(() => {
      getPubSub().emit(Event.RUN_CANCELLED, cancelReason);
    }, 100);

    // @ts-expect-error
    await runTillDoneOrCancelled();
    expect(runTillDone).toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.any(String), cancelReason);
    expect(getPubSub().listeners(Event.RUN_CANCELLED)).toHaveLength(0);
  });
});
