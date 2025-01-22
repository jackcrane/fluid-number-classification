import { findNearestVector } from "./findNearestVector.js";
import { generateLetterVector } from "./generateLetterVector.js";
import { loadTest } from "./load.js";
import chalk from "chalk";
import { generateLetterImage } from "./generateLetterImage.js";

const mnist = loadTest();

let successCount = 0;
let failCount = 0;

for (let i = 0; i < mnist.length; i++) {
  const imageData = mnist[i];
  const vector = generateLetterVector(imageData);

  const nearest = findNearestVector(vector.vector);

  if (nearest.nearestVector.character !== vector.character) {
    // Render and save the failed image
    // generateLetterImage(imageData, {
    //   writeImage: true,
    //   idx: `failed-${i}-found-${nearest.nearestVector.character}-expected-${vector.character}`,
    // });

    failCount++;
    console.log(
      chalk.redBright("FAIL"),
      chalk.red(failCount),
      chalk.green(successCount),
      chalk.yellow(
        ((successCount / (successCount + failCount)) * 100).toFixed(2)
      ),
      `${nearest.nearestVector.character} !== ${vector.character} on image ${i}`
    );
  } else {
    successCount++;
    console.log(
      chalk.greenBright("PASS"),
      chalk.red(failCount),
      chalk.green(successCount),
      chalk.yellow(
        ((successCount / (successCount + failCount)) * 100).toFixed(2)
      ),
      `${nearest.nearestVector.character} === ${vector.character} on image ${i}`
    );
  }
}

console.log(
  "Successes:",
  chalk.green(successCount),
  "Failures:",
  chalk.red(failCount),
  "Pass Percentage:",
  chalk.yellow(((successCount / (successCount + failCount)) * 100).toFixed(2))
);
