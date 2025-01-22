import e from "express";
import { findNearestVector } from "./findNearestVector.js";
import { generateLetterVector } from "./generateLetterVector.js";
import { loadTest } from "./load.js";
import chalk from "chalk";

const mnist = loadTest();

let successCount = 0;
let failCount = 0;

for (let i = 0; i < 10000; i++) {
  const imageData = mnist[i];
  const vector = generateLetterVector(imageData);

  const nearest = findNearestVector(vector.vector);

  if (nearest.nearestVector.character !== vector.character) {
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
