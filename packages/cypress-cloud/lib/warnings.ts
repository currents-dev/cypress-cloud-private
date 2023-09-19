import chalk from "chalk";
import plur from "plur";
import { warn } from "./log";
import { ExecutionState } from "./state";

export function printWarnings(executionState: ExecutionState) {
  const warnings = Array.from(executionState.getWarnings());
  if (warnings.length > 0) {
    warn(
      `${warnings.length} ${plur(
        "Warning",
        warnings.length
      )} encountered during the execution:\n${warnings
        .map(
          (w, i) => `\n${chalk.yellow(`[${i + 1}/${warnings.length}]`)} ${w}`
        )
        .join("\n")}`
    );
  }
}
