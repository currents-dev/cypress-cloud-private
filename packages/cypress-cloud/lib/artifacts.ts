import Debug from "debug";
import { ScreenshotArtifact, ScreenshotUploadInstruction } from "../types";
import { updateInstanceStdout } from "./api";
import { safe } from "./lang";
import { format } from "./log";
import { ExecutionState } from "./state";
import { uploadImage, uploadJson, uploadVideo } from "./upload";
const debug = Debug("currents:artifacts");
interface UploadArtifacts {
  executionState: ExecutionState;
  videoPath: string | null;
  videoUploadUrl?: string | null;
  screenshots: ScreenshotArtifact[];
  screenshotUploadUrls: ScreenshotUploadInstruction[];
  coverageUploadUrl?: string | null;
  coverageFilePath?: string | null;
}
export async function uploadArtifacts({
  executionState,
  videoPath,
  videoUploadUrl,
  screenshots,
  screenshotUploadUrls,
  coverageFilePath,
  coverageUploadUrl,
}: UploadArtifacts) {
  // title("blue", "Uploading  Results");

  debug("uploading artifacts: %o", {
    videoPath,
    videoUploadUrl,
    screenshots,
    screenshotUploadUrls,
    coverageFilePath,
    coverageUploadUrl,
  });

  const totalUploads =
    (videoPath ? 1 : 0) + screenshots.length + (coverageUploadUrl ? 1 : 0);
  if (totalUploads === 0) {
    // info("Nothing to upload");
    return;
  }

  // upload video
  if (videoUploadUrl && videoPath) {
    await safe(
      uploadVideo,
      (e) => {
        debug("failed uploading video %s. Error: %o", videoPath, e);
        executionState.addWarning(
          format("Failed uploading video %s. Error: %s", videoPath, e)
        );
      },
      () => debug("success uploading", videoPath)
    )(videoPath, videoUploadUrl);
  }
  // upload screenshots
  if (screenshotUploadUrls && screenshotUploadUrls.length) {
    await Promise.all(
      screenshots.map((screenshot) => {
        const url = screenshotUploadUrls.find(
          (urls) => urls.screenshotId === screenshot.screenshotId
        )?.uploadUrl;
        if (!url) {
          debug(
            "No upload url for screenshot %o, screenshotUploadUrls: %o",
            screenshot,
            screenshotUploadUrls
          );
          executionState.addWarning(
            format("No upload URL for screenshot: %s", screenshot.path)
          );
          return Promise.resolve();
        }
        return safe(
          uploadImage,
          (e) => {
            debug(
              "failed uploading screenshot %s. Error: %o",
              screenshot.path,
              e
            );
            executionState.addWarning(
              format(
                "Failed uploading screenshot %s. Error: %s",
                screenshot.path,
                e
              )
            );
          },
          () => debug("success uploading", screenshot.path)
        )(screenshot.path, url);
      })
    );
  }
  // upload coverage
  if (coverageUploadUrl && coverageFilePath) {
    await safe(
      uploadJson,
      (e) => {
        debug(
          "failed uploading coverage file %s. Error: %o",
          coverageFilePath,
          e
        );
        executionState.addWarning(
          format(
            "Failed uploading coverage file %s. Error: %s",
            coverageFilePath,
            e
          )
        );
      },

      () => debug("success uploading", coverageFilePath)
    )(coverageFilePath, coverageUploadUrl);
  }
}

export const uploadStdoutSafe = safe(
  updateInstanceStdout,
  () => {},
  () => {}
);
