export let _runId: string | undefined = undefined;
export const setRunId = (runId: string) => {
  _runId = runId;
};

export let _cypressVersion: string | undefined = undefined;
export const setCypressVersion = (cypressVersion: string) => {
  _cypressVersion = cypressVersion;
};

export let _currentsVersion: string | undefined = undefined;
export const setCurrentsVersion = (v: string) => {
  _currentsVersion = v;
};
