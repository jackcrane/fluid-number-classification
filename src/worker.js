import { parentPort, workerData } from "worker_threads";
import { generateLetterVector } from "./generateLetterVector.js";

const { images, startIndex } = workerData;

images.forEach((imageData, idx) => {
  const startTime = performance.now();
  const vector = generateLetterVector(imageData);
  const endTime = performance.now();

  parentPort.postMessage({
    type: "progress",
    message: `Processed index ${startIndex + idx}, time: ${
      endTime - startTime
    }ms`,
  });

  parentPort.postMessage({
    type: "result",
    index: startIndex + idx,
    vector: vector,
  });
});

parentPort.postMessage({
  type: "done",
  message: `Worker completed batch starting from index ${startIndex}`,
});
