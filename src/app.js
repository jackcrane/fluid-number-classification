import { load } from "./load.js";
import { generateLetterImage } from "./generateLetterImage.js";
import { rmSync, mkdirSync } from "fs";
import { floodFillLetter } from "./floodFillLetter.js";

rmSync("./images", { recursive: true });
mkdirSync("./images");

const mnist = load();

floodFillLetter(mnist[4], true);
