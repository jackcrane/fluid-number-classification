import { logTimings } from "./logTimings.js";

/**
 *
 * @param {Array} array An input array. Should be 1x784.
 * @returns {Array} A 28x28 array of pixels
 */
export const reshapeArray = (array) => {
  const width = 28;
  const height = 28;

  const newArray = [];
  for (let x = 0; x < height; x++) {
    const row = [];
    for (let y = 0; y < width; y++) {
      row.push(array[y * height + x]);
    }
    newArray.push(row);
  }

  return newArray;
};
