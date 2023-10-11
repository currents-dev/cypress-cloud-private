import { BPromise } from "../lang";
import { warn } from "../log";
import { Event, getPubSub } from "../pubsub";
import { runTillDone } from "./runner";

let cancellable: {
  cancel: () => void;
} | null = null;

function onRunCancelled(reason: string) {
  warn(
    `Run cancelled: %s. Waiting for uploads to complete and stopping execution...`,
    reason
  );
  cancellable?.cancel();
}
export async function runTillDoneOrCancelled(
  ...args: Parameters<typeof runTillDone>
) {
  return new Promise((_resolve, _reject) => {
    cancellable = new BPromise((resolve, reject, onCancel) => {
      if (!onCancel) {
        _reject(new Error("BlueBird is misconfigured: onCancel is undefined"));
        return;
      }
      onCancel(() => _resolve(void 0));
      runTillDone(...args).then(
        () => {
          resolve();
          _resolve(void 0);
        },
        (error) => {
          reject();
          _reject(error);
        }
      );
    });

    getPubSub().addListener(Event.RUN_CANCELLED, onRunCancelled);
  }).finally(() => {
    getPubSub().removeListener(Event.RUN_CANCELLED, onRunCancelled);
  });
}
