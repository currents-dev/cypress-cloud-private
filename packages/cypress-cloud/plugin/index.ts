/// <reference types="Cypress" />

import fs from "fs";
import { format } from "util";
import WebSocket from "ws";
import _ from "lodash"

export async function cloudPlugin(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) {


  function debug(...args: unknown[]) {
    if (config.env.currents_debug_enabled) {
      console.debug("[currents:plugin]", format(...args));
    }
  }

  on("after:screenshot", (details) => {
    sendToWS({
      type: "after:screenshot",
      payload: details,
    });
  });

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

  on("task", {
    "currents:test:after:run": (test) => {
      sendToWS({
        type: "test:after:run",
        payload: test,
      });
      return null;
    },
    "currents:test:before:run": (test) => {
      sendToWS({
        type: "test:before:run",
        payload: test,
      });
      return null;
    },
  });

  debug("currents plugin loaded");

  if (config.env.currents_temp_file) {
    debug("dumping config to '%s'", config.env.currents_temp_file);
    fs.writeFileSync(config.env.currents_temp_file, JSON.stringify(config));
    debug("config is availabe at '%s'", config.env.currents_temp_file);
  }

  on("before:spec", (spec) => {
    sendToWS({ type: "before:spec", payload: { spec } });
  });

  on("after:spec", (spec, results) => {
    sendToWS({
      type: "after:spec",
      payload: {
        spec,
        results
      },
    });
  });

  return config;
}

export default cloudPlugin;
