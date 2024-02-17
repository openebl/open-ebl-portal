import { clsx, type ClassValue } from "clsx";
import crypto from "crypto";
import { mkdtemp } from "fs";
import os from "os";
import path from "path";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomId(len = 20): string {
  const isNode = process?.versions?.node != null;

  if (isNode) {
    // hack to get crypto.getRandomValues working in node.
    // eslint-disable-next-line
    const arr = require("crypto").randomBytes(len) as Buffer;
    return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
  } else {
    const arr = new Uint8Array(len / 2);
    crypto.getRandomValues(arr);
    return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
  }
}

export const tempFolder: () => Promise<string> = () => {
  return new Promise<string>((resolve, reject) => {
    mkdtemp(path.join(`${os.tmpdir()}${path.sep}`), (err, directory) => {
      if (err) {
        reject(err);
      } else {
        resolve(directory);
      }
    });
  });
};
