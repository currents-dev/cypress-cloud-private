export enum Event {
  RUN_CANCELLED = "run:cancelled",
  RUN_RESULT = "run:result",
  TEST_AFTER_RUN = "test:after:run",
  TEST_BEFORE_RUN = "test:before:run",
  AFTER_SCREENSHOT = "after:screenshot",
  AFTER_SPEC = "after:spec",
}
export const allEvents = Object.values(Event);
