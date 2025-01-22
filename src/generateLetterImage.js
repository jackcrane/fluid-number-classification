import { createCanvas } from "canvas";
import fs from "fs";
import { reshapeArray } from "./reshapeArray.js";
import { logTimings } from "./logTimings.js";

/**
 *
 * @param {Object} mnistLetter of shape {"8": [...]}
 * @param {Object} options
 * @returns
 */
export const generateLetterImage = (mnistLetter, options) => {
  const startTime = performance.now();

  const writeImage = options.writeImage || false;
  const idx = options.idx || false;
  const preReshapen = options.preReshapen || false;
  const forceFillPixels = options.forceFillPixels || false;

  const imageName = Object.keys(mnistLetter)[0];
  const imageData = preReshapen
    ? Object.values(mnistLetter)[0]
    : reshapeArray(Object.values(mnistLetter)[0]);

  const canvas = createCanvas(28, 28);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 28, 28);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 28, 28);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 28, 28);
  for (let x = 0; x <= 27; x++) {
    for (let y = 0; y <= 27; y++) {
      if (forceFillPixels && forceFillPixels[x]?.[y]) {
        ctx.fillStyle = "#FF0000";
      } else {
        const pixel = imageData[x][y];
        ctx.fillStyle = `rgb(${pixel}, ${pixel}, ${pixel})`;
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
  if (writeImage) {
    // const imagePath = `./images/${imageName}${idx && `-${idx}`}.png`;
    const imagePath = `./images/${idx}.png`;
    canvas.createPNGStream().pipe(fs.createWriteStream(imagePath));
  }
  const buf = canvas.toBuffer();
  const endTime = performance.now();
  logTimings("generateLetterImage", startTime, endTime);
  return buf;
};

export const getEmptyArray = () => {
  return Array.from({ length: 28 }, () => Array(28).fill(false));
};

export const getOtherwiseEmptyArray = (x, y) => {
  console.log(x, y);
  const arr = getEmptyArray();
  arr[x][y] = true;
  return arr;
};
