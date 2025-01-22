import { load } from "./load.js";
import { generateLetterImage } from "./generateLetterImage.js";
import { rmSync, mkdirSync } from "fs";
import { floodFillLetter } from "./floodFillLetter.js";

rmSync("./images", { recursive: true });
mkdirSync("./images");

const mnist = load();
// console.log(mnist);

// for (let i = 0; i < 670; i++) {
//   const imageData = mnist[i];
//   generateLetterImage(imageData, {
//     writeImage: true,
//     idx: String(i).padStart(4, "0"),
//     // preReshapen: true,
//   });
// }

floodFillLetter(mnist[4]);
