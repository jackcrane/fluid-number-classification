import { findNearestVector } from "./findNearestVector.js";
import { generateLetterVector } from "./generateLetterVector.js";
import { loadTest } from "./load.js";
import chalk from "chalk";
import { generateLetterImage } from "./generateLetterImage.js";

const mnist = loadTest();

let successCount = 0;
let failCount = 0;

let fail1count = 0;
let fail2count = 0;
let fail3count = 0;
let fail4count = 0;
let fail5count = 0;
let fail6count = 0;
let fail7count = 0;
let fail8count = 0;
let fail9count = 0;
let fail0count = 0;

for (let i = 0; i < 1000; i++) {
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

    if (nearest.nearestVector.character === "0") {
      fail0count++;
    }
    if (nearest.nearestVector.character === "1") {
      fail1count++;
    }
    if (nearest.nearestVector.character === "2") {
      fail2count++;
    }
    if (nearest.nearestVector.character === "3") {
      fail3count++;
    }
    if (nearest.nearestVector.character === "4") {
      fail4count++;
    }
    if (nearest.nearestVector.character === "5") {
      fail5count++;
    }
    if (nearest.nearestVector.character === "6") {
      fail6count++;
    }
    if (nearest.nearestVector.character === "7") {
      fail7count++;
    }
    if (nearest.nearestVector.character === "8") {
      fail8count++;
    }
    if (nearest.nearestVector.character === "9") {
      fail9count++;
    }
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
  chalk.yellow(((successCount / (successCount + failCount)) * 100).toFixed(2)),
  {
    fail0count,
    fail1count,
    fail2count,
    fail3count,
    fail4count,
    fail5count,
    fail6count,
    fail7count,
    fail8count,
    fail9count,
  }
);
