import { load } from "./load.js";
import { rmSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { floodFillLetter } from "./floodFillLetter.js";
import { reshapeArray } from "./reshapeArray.js";
import { rotateArray } from "./rotateArray.js";
import { generateLetterVector } from "./generateLetterVector.js";

rmSync("./images", { recursive: true });
mkdirSync("./images");

const mnist = load();

let vectors = [];

for (let i = 0; i < mnist.length; i++) {
  const startTime = performance.now();
  const imageData = mnist[i];
  const vector = generateLetterVector(imageData);
  vectors[i] = vector;
  const endTime = performance.now();

  console.log(vector.character, i, endTime - startTime);

  if (i % 10 === 0) {
    writeFileSync(`./vectors.json`, JSON.stringify(vectors));
  }
}
