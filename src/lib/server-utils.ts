import { mkdtemp } from "fs";
import os from "os";
import path from "path";

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
