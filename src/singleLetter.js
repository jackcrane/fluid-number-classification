import { load } from "./load.js";
import { rmSync, mkdirSync } from "fs";
import { floodFillLetter } from "./floodFillLetter.js";
import { exec } from "child_process";
import { generateLetterVector } from "./generateLetterVector.js";

rmSync("./images", { recursive: true });
mkdirSync("./images");

const mnist = load();

// floodFillLetter(mnist[4], true, 0);
const startTime = performance.now();
generateLetterVector(mnist[4]);
const endTime = performance.now();
console.log(endTime - startTime);

exec("yarn video:large -y");
