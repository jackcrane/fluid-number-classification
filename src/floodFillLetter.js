import { generateLetterImage, getEmptyArray } from "./generateLetterImage.js";
import { reshapeArray } from "./reshapeArray.js";
import { generateId } from "./generateId.js";
import { logTimings } from "./logTimings.js";
import { rotateArray } from "./rotateArray.js";

const internalFloodFill = (
  imageData,
  startX,
  startY,
  forceFillPixels,
  limited = false
) => {
  const startTime = performance.now();
  const queue = [[startX, startY]];
  const rows = imageData.length;
  const cols = imageData[0].length;

  let count = 0;

  while (queue.length) {
    count++;
    const [x, y] = queue.shift(); // Dequeue the front element

    // Boundary check and fill condition
    if (
      x < 0 ||
      y < 0 ||
      x >= rows ||
      y >= cols ||
      imageData[x][y] > 0 ||
      forceFillPixels[x][y]
    ) {
      continue;
    }

    // Mark the pixel as filled
    forceFillPixels[x][y] = true;

    // Push neighbors to the queue (4-directional flood fill)
    queue.push([x - 1, y]); // left
    queue.push([x + 1, y]); // right
    !limited && queue.push([x, y - 1]); // up
    queue.push([x, y + 1]); // down

    const endTime = performance.now();
    logTimings("floodFill", startTime, endTime);

    // generateLetterImage(
    //   { character: imageData },
    //   {
    //     writeImage: true,
    //     idx: String(count).padStart(4, "0"),
    //     forceFillPixels: forceFillPixels,
    //     preReshapen: true,
    //   }
    // );
  }

  return forceFillPixels;
};

export const floodFillLetter = (
  imageData,
  limited = false,
  rotateSteps = 0
) => {
  const character = Object.keys(imageData)[0];
  const characterData = imageData[character];

  const simplifiedCharacterData = characterData.map((pixel) => {
    return pixel > 128 ? 256 : 0;
  });

  const simplifiedImageReshaped = reshapeArray(simplifiedCharacterData);

  let rotatedSimplifiedImageReshaped = simplifiedImageReshaped;
  for (let i = 0; i < rotateSteps; i++) {
    rotatedSimplifiedImageReshaped = rotateArray(
      rotatedSimplifiedImageReshaped
    );
  }

  // Start the flood fill at the top center
  const x = rotatedSimplifiedImageReshaped.length / 2;
  const flooded = internalFloodFill(
    rotatedSimplifiedImageReshaped,
    x,
    0,
    getEmptyArray(),
    limited
  );

  const numFilledPixels = flooded.reduce(
    (acc, arr) => acc + arr.filter((x) => x).length,
    0
  );

  const numFilledPixelsFirstHalf = flooded.reduce(
    (acc, arr) =>
      acc + arr.slice(0, Math.floor(arr.length / 2)).filter((x) => x).length,
    0
  );

  const numFilledPixelsSecondHalf = flooded.reduce(
    (acc, arr) =>
      acc + arr.slice(Math.floor(arr.length / 2)).filter((x) => x).length,
    0
  );

  return [
    character,
    numFilledPixels,
    numFilledPixelsFirstHalf,
    numFilledPixelsSecondHalf,
  ];

  /*
  generateLetterImage(
    { [character]: simplifiedCharacterData },
    {
      writeImage: true,
      idx: "simplified",
    }
  );

  generateLetterImage(imageData, {
    writeImage: true,
    idx: "original",
  });
  */
};
