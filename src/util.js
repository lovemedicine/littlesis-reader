import { debugMode } from "./config.js";

export function log(...args) {
  if (debugMode) {
    console.log(...args);
  }
}

export function chunkArray(arr, size) {
  let result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}
