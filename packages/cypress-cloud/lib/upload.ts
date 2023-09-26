import fs from "fs";
import { makeRequest } from "./httpClient";
import { Debug } from "./remote-debug";
const readFile = fs.promises.readFile;
const debug = Debug("currents:upload");

export function uploadVideo(file: string, url: string) {
  return uploadFile(file, url, "video/mp4");
}

export function uploadImage(file: string, url: string) {
  return uploadFile(file, url, "image/png");
}

export function uploadJson(file: string, url: string) {
  return uploadFile(file, url, "application/json");
}
export function uploadText(file: string, url: string) {
  return uploadFile(file, url, "plain/text");
}

type UploadTypes =
  | "video/mp4"
  | "image/png"
  | "plain/text"
  | "application/json";

export async function uploadFile(file: string, url: string, type: UploadTypes) {
  debug('uploading file "%s" to "%s"', file, url);
  const f = await readFile(file);
  await makeRequest({
    url,
    method: "PUT",
    data: f,
    headers: {
      "Content-Type": type,
      "Content-Disposition": `inline`,
    },
  });
}
