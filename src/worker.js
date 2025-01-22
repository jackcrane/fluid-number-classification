import { parentPort, workerData } from "worker_threads";
import { generateLetterVector } from "./generateLetterVector.js";

const { images, startIndex } = workerData;

images.forEach((imageData, idx) => {
  const startTime = performance.now();
  const vector = generateLetterVector(imageData);
  const endTime = performance.now();

  console.log(vector.character, startIndex + idx, endTime - startTime);

  parentPort.postMessage({
    index: startIndex + idx,
    vector: vector,
  });
});
