import {
  CurrentsRunParameters,
  CypressRunParameters,
} from "cypress-cloud/types";
import Debug from "debug";
import _ from "lodash";
import { getCypressRunAPIParams } from "../config";
import { shouldEnablePluginDebug } from "../debug";
import { sortObjectKeys } from "../lang";
import { getRandomString } from "../nano";
const debug = Debug("currents:boot");

export function getBootstrapArgs({
  params,
  tempFilePath,
}: {
  params: CurrentsRunParameters;
  tempFilePath: string;
}) {
  return _.chain(getCypressCLIParams(params))
    .thru((opts) => ({
      ...opts,
      // merge the env with the currents specific env variables
      env: {
        ...(opts.env ?? {}),
        currents_marker: true,
        currents_temp_file: tempFilePath,
        currents_debug_enabled: shouldEnablePluginDebug(params.cloudDebug),
      },
    }))
    .tap((opts) => {
      debug("cypress bootstrap params: %o", opts);
    })
    .thru((opts) => ({
      ...opts,
      env: sortObjectKeys(opts.env ?? {}),
    }))
    .thru(serializeOptions)
    .tap((opts) => {
      debug("cypress bootstrap serialized params: %o", opts);
    })
    .thru((args) => {
      return [
        ...args,
        "--spec",
        getRandomString(),
        params.testingType === "component" ? "--component" : "--e2e",
      ];
    })
    .value();
}

/**
 * Converts Currents options to Cypress CLI params.
 * Cypress CLI options are different from Cypress module API options.
 *
 * @param params Currents param
 * @returns Cypress CLI params
 * @see https://docs.cypress.io/guides/guides/command-line#cypress-run
 * @see https://docs.cypress.io/api/module-api
 */
function getCypressCLIParams(
  params: CurrentsRunParameters
): CypressRunParameters {
  const result = getCypressRunAPIParams(params);
  const testingType =
    result.testingType === "component"
      ? {
          component: true,
        }
      : {};
  return {
    ..._.omit(result, "testingType"),
    ...testingType,
  };
}

function serializeOptions(options: Record<string, unknown>): string[] {
  return Object.entries(options).flatMap(([key, value]) => {
    const _key = dashed(key);
    if (typeof value === "boolean") {
      return value === true ? [`--${_key}`] : [`--${_key}`, false];
    }

    if (_.isObject(value)) {
      return [`--${_key}`, serializeComplexParam(value)];
    }

    // @ts-ignore
    return [`--${_key}`, value.toString()];
  });
}

function serializeComplexParam(param: {}) {
  return JSON.stringify(param);
}

const dashed = (v: string) => v.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
