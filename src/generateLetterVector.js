import { floodFillLetter } from "./floodFillLetter.js";

export const generateLetterVector = (imageData) => {
  const vector = [];

  const ffl = floodFillLetter(imageData, false, 0);

  let [, buoyancy] = ffl;
  vector.push(buoyancy);

  let character;

  for (let i = 0; i < 4; i++) {
    const letterVectorComponent = floodFillLetter(imageData, true, i);
    vector.push(letterVectorComponent[2]);
    vector.push(letterVectorComponent[3]);
    character = letterVectorComponent[0];
  }

  return { character, vector };
};
