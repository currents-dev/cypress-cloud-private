/// <reference types="Cypress" />

import Debug from "debug";
import fs from "fs";
import { format } from "util";
import WebSocket from "ws";
import { configSlugs } from "..";
import { dim, warn } from "../lib/log";
import { Event } from "../lib/pubsub";

const _debug = Debug("currents:plugin");
export async function cloudPlugin(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) {
  function debug(...args: unknown[]) {
    if (config.env.currents_debug_enabled) {
      _debug(format(...args));
    }
  }

  if (!config.env.currents_marker) {
    warn(
      `Currents plugin is not installed properly - missing required variables in ${dim(
        "cypress.env"
      )}. Please refer to: https://github.com/currents-dev/cc-est#setup-with-existing-plugins`
    );
  }

  let ws: WebSocket | null = null;
  function sendToWS(message: unknown) {
    if (ws) {
      ws.send(JSON.stringify(message));
    }
  }

  if (config.env.currents_ws) {
    debug("setting port to %s", config.env.currents_ws);
    await new Promise((resolve) => {
      ws = new WebSocket(`ws://localhost:${config.env.currents_ws}`);
      ws.on("open", () => {
        resolve(null);
      });
    });
  }

  on("after:screenshot", (details) => {
    sendToWS({
      type: Event.AFTER_SCREENSHOT,
      payload: details,
    });
  });

  on("task", {
    "currents:test:after:run": (test) => {
      debug("currents:test:after:run task received %o", test);
      sendToWS({
        type: Event.TEST_AFTER_RUN,
        payload: test,
      });
      return null;
    },
    "currents:test:before:run": (test) => {
      debug("currents:test:before:run task received %o", test);
      sendToWS({
        type: Event.TEST_BEFORE_RUN,
        payload: test,
      });
      return null;
    },
  });

  on("before:spec", (spec) => {
    debug("before:spec task received %o", spec);
    sendToWS({ type: "before:spec", payload: { spec } });
  });

  on("after:spec", (spec, results) => {
    debug("after:spec task received %o", spec);
    sendToWS({
      type: Event.AFTER_SPEC,
      payload: {
        spec,
        results,
      },
    });
  });

  debug("currents plugin loaded");

  const configFileDumpPath = config.env[configSlugs.temp_file];
  if (configFileDumpPath) {
    debug("dumping config to '%s'", configFileDumpPath);
    fs.writeFileSync(configFileDumpPath, JSON.stringify(config));
    debug("config is availabe at '%s'", configFileDumpPath);
  }

  return config;
}

export default cloudPlugin;
