import bluebird from "bluebird";

bluebird.Promise.config({
  cancellation: true,
});
export const BPromise = bluebird.Promise;

export const safe =
  <T extends any[], R extends any, F extends any>(
    fn: (...args: T) => Promise<R>,
    ifFaled: (e: unknown) => F,
    ifSucceed: () => any
  ) =>
  async (...args: T) => {
    try {
      const r = await fn(...args);
      ifSucceed();
      return r;
    } catch (e) {
      return ifFaled(e);
    }
  };

export const sortObjectKeys = <T extends Record<string, any>>(obj: T) => {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      // @ts-ignore
      acc[key] = obj[key];
      return acc;
    }, {} as T);
};
