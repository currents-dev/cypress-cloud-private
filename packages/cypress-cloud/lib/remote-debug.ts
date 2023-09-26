import Debug from "debug";
import fs from "fs";
import utils from "util";
import { getDebugUrl } from "./api";
import { dim, info } from "./log";
import { getRandomString } from "./nano";
import { uploadText } from "./upload";

const original = Debug.log;

const tempFile = `/tmp/currents-debug_${getRandomString()}.log`;
const writepipe = fs.createWriteStream(tempFile, { flags: "a" });

Debug.log = (...params) => {
  writepipe.write(`${utils.format(...params)}\n`);
  original(...params);
};

export async function finalizeDebug({
  recordKey,
  runId,
}: {
  recordKey: string;
  runId: string;
}) {
  writepipe.end();
  Debug.log = original;

  info(`Debug log written to ${dim(tempFile)}`);

  const { readUrl, uploadUrl } = await getDebugUrl({ recordKey, runId });
  await uploadText(tempFile, uploadUrl);
  info(`Debug log uploaded to ${dim(readUrl)}`);
}

export { Debug };
