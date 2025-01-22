import { load } from "./load.js";
import { generateLetterImage } from "./generateLetterImage.js";
import { rmSync, mkdirSync } from "fs";
import { floodFillLetter } from "./floodFillLetter.js";
import { reshapeArray } from "./reshapeArray.js";
import { rotateArray } from "./rotateArray.js";

rmSync("./images", { recursive: true });
mkdirSync("./images");

const mnist = load();

// floodFillLetter(mnist[4], true, 1);
floodFillLetter(mnist[4], true, 3);
// floodFillLetter(mnist[4], true, 3);
