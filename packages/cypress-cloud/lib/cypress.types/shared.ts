export type TestState = "failed" | "passed" | "pending" | "skipped";
export type TestAttemptState = "failed" | "passed" | "pending";
export type TestingType = "e2e" | "component";
export interface MochaError {
  message: string;
  name: string;
  stack: string;
  parsedStack: MochaParsedStackItem[];
  codeFrame: MochaCodeFrame;
}

export interface MochaInvocationDetails {
  function: string;
  fileUrl: string;
  originalFile: string;
  relativeFile: string;
  absoluteFile: string;
  line: number;
  column: number;
  whitespace: string;
  stack: string;
}

export interface MochaCodeFrame {
  line: number;
  column: number;
  originalFile: string;
  relativeFile: string;
  absoluteFile: string;
  frame: string;
  language: string;
}

export interface MochaParsedStackItem {
  message: string;
  whitespace: string;
  function?: string;
  fileUrl?: string;
  originalFile?: string;
  relativeFile?: string;
  absoluteFile?: string;
  line?: number;
  column?: number;
}

export interface MochaHook {
  title: string;
  hookName: string;
  hookId: string;
  pending: boolean;
  body: string;
  type: string;
  file: null | string;
  invocationDetails: MochaInvocationDetails;
  currentRetry: number;
  retries: number;
  _slow: number;
}

type TimingKey = "before each" | "after each" | "after all" | "before all";
export type Timing = {
  [key in TimingKey]?: HookTimingItem;
} & {
  lifecycle: number;
  test: TimingItem;
};

export interface HookTimingItem extends TimingItem {
  hookId: string;
}
export interface TimingItem {
  fnDuration: number;
  afterFnDuration: number;
}
