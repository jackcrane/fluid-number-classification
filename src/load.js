/* https://stackoverflow.com/a/76727169 */

import fs from "fs";
import os from "os";
import { logTimings } from "./logTimings.js";

const internalLoad = (labelsFilePath, imagesFilePath) => {
  const labelsFileBuffer = fs.readFileSync(labelsFilePath);
  const dataFileBuffer = fs.readFileSync(imagesFilePath);
  const pixelValues = [];
  let image = 0;

  while (true) {
    const imageData = {};
    const label = labelsFileBuffer[image + 8];
    const pixels = [];

    if (typeof label == "undefined") {
      break;
    }

    for (let x = 0; x <= 27; x++) {
      for (let y = 0; y <= 27; y++) {
        pixels.push(dataFileBuffer[image * 28 * 28 + (x * 28 + y) + 15]);
      }
    }

    imageData[label] = pixels;
    pixelValues.push(imageData);
    image += 1;
  }
  return pixelValues;
};

export const load = () => {
  // sample usage:
  const startTime = performance.now();
  const mnist = internalLoad(
    `${os.homedir()}/Downloads/train-labels.idx1-ubyte`,
    `${os.homedir()}/Downloads/train-images.idx3-ubyte`
  );
  const endTime = performance.now();
  logTimings("load", startTime, endTime);

  return mnist;
};
