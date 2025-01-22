import { generateLetterImage } from "./generateLetterImage.js";
import { loadTest } from "./load.js";
import { exec } from "child_process";
import chalk from "chalk";
import { generateLetterVector } from "./generateLetterVector.js";
import { findNearestVector } from "./findNearestVector.js";

const mnist = loadTest();

const randomImage = mnist[Math.floor(Math.random() * mnist.length)];

generateLetterImage(randomImage, {
  writeImage: true,
  idx: "original",
});

console.log(
  "Testing image with correct label:",
  chalk.redBright(Object.keys(randomImage)[0])
);
console.log(
  "A rendered image is saved to",
  chalk.blueBright("./images/original.png")
);

const { vector } = generateLetterVector(randomImage);
const nearest = findNearestVector(vector);

console.log(
  `The nearest matched character is ${chalk.redBright(
    nearest.nearestVector.character
  )}, and is at a distance of ${chalk.blueBright(
    nearest.nearestDistance.toFixed(2)
  )} from the current vector.`
);
