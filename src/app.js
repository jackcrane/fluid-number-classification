import { load } from "./load.js";
import { generateLetterImage } from "./generateLetterImage.js";
import { rmSync, mkdirSync } from "fs";
import { floodFillLetter } from "./floodFillLetter.js";

rmSync("./images", { recursive: true });
mkdirSync("./images");

const mnist = load();
console.log(mnist);

floodFillLetter(mnist[428]);
