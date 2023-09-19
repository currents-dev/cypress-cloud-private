import EventEmitter from "events";

let _pubsub: EventEmitter | null = null;
export const getPubSub = () => {
  if (!_pubsub) {
    _pubsub = new EventEmitter();
  }
  return _pubsub;
};
