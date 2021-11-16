import { LOG_LEVEL } from './config.js';

const lvl = {
  NONE: -1,
  ERROR: 0,
  INFO: 1,
  DEBUG: 2
}


// Level

let levelIndex;

export const setLogLevel = level => {
  levelIndex = lvl[level] || lvl.NONE;
}

setLogLevel(LOG_LEVEL);


// Enabled

export const enabled = {};
Object.defineProperty(enabled, 'ERROR', {get: () => levelIndex >= lvl.ERROR, enumerable: true});
Object.defineProperty(enabled, 'INFO',  {get: () => levelIndex >= lvl.INFO,  enumerable: true});
Object.defineProperty(enabled, 'DEBUG', {get: () => levelIndex >= lvl.DEBUG, enumerable: true});

// Logs

const prepare = (args, level) => {
  args.unshift(new Date().toJSON());
  args.unshift(`[${level.toUpperCase()}]`);

  args = args.map(arg => {
    if (typeof arg === 'function') return arg();
    return arg;
  });

  return args;
}

const error = (...args) => {
  if (!enabled.ERROR) return;
  console.error.apply(console, prepare(args, 'error'));
}

const info = (...args) => {
  if (!enabled.INFO) return;
  console.log.apply(console, prepare(args, 'info'));
}

const debug = (...args) => {
  if (!enabled.DEBUG) return;
  console.log.apply(console, prepare(args, 'debug'));
}

export default {
  info, error, debug
};
