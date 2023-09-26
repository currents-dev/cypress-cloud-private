import Debug from "debug";
import fs from "fs";
import os from "os";
import path from "path";
import utils from "util";
import { CurrentsRunParameters } from "../types";
import { getDebugUrl } from "./api";
import { shouldEnableRemoteDebug } from "./debug";
import { dim, info, warn } from "./log";
import { getRandomString } from "./nano";
import { uploadText } from "./upload";

const original = Debug.log;
const debug = Debug("currents:remote-debug");

const pipelines: Record<
  string,
  {
    type: "cli" | "core";
    id: string;
    writeStream: fs.WriteStream;
    tempFilePath: string;
  }
> = {};

export async function initRemoteDebug(
  params: {
    cloudDebugSilent?: CurrentsRunParameters["cloudDebugSilent"];
    cloudDebugRemote?: CurrentsRunParameters["cloudDebugRemote"];
    cloudDebug?: CurrentsRunParameters["cloudDebug"];
  },
  type: "cli" | "core" = "core"
) {
  const id = getRandomString();

  if (!shouldEnableRemoteDebug(params)) {
    debug(`Skipping remote debug for mode %o`, params);
    return id;
  }

  const tempFilePath = path.resolve(
    os.tmpdir(),
    `currents-debug_${type}_${id}.log`
  );
  debug(`Init remote debug %s %s`, id, tempFilePath);

  const writeStream = fs.createWriteStream(tempFilePath, { flags: "a" });
  pipelines[id] = {
    type,
    id,
    writeStream,
    tempFilePath,
  };

  Debug.log = (...args) => {
    writeStream.write(`${utils.format(...args)}\n`);
    if (!params.cloudDebugSilent) {
      original(...args);
    }
  };
  return id;
}
export async function finalizeDebug({ runId }: { runId: string }) {
  try {
    const ids = Object.keys(pipelines);

    if (ids.length === 0) {
      debug(`No debug pipelines found`);
      Debug.log = original;
    }

    for (const id of ids) {
      await uploadDebug(id, runId);
    }
  } finally {
    Debug.log = original;
  }
}

async function uploadDebug(id: string, runId: string) {
  const pipeline = pipelines[id];

  if (!pipeline) {
    debug(`No debug pipeline found for id %s`, id);
    return;
  }

  info(`👾 Debug log written: ${dim(pipeline?.tempFilePath)}`);

  try {
    const { readUrl, uploadUrl } = await getDebugUrl({
      runId,
      type: pipeline.type,
    });
    await uploadText(pipeline.tempFilePath, uploadUrl);
    pipeline?.writeStream.end();
    info(`👾 Debug log uploaded: ${dim(readUrl)}`);
  } catch (e) {
    warn(
      `Failed to upload debug log ${dim(pipeline.tempFilePath)}: ${
        (e as Error).message
      }`
    );
  }
}
export { Debug };
