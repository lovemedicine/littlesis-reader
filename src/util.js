import { debugMode } from "./config.js";

export function log(...args) {
  if (debugMode) {
    console.log(...args);
  }
}
