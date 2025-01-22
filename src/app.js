import { load } from "./load.js";
import { Worker } from "worker_threads";
import { rmSync, mkdirSync, writeFileSync } from "fs";

rmSync("./images", { recursive: true });
mkdirSync("./images");

const mnist = load();
const vectors = new Array(mnist.length);
const numWorkers = 4; // Adjust based on your CPU cores
let completedTasks = 0;

const processBatch = (start, end) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./src/worker.js", {
      workerData: { images: mnist.slice(start, end), startIndex: start },
    });

    worker.on("message", (message) => {
      const { index, vector } = message;
      vectors[index] = vector;
    });

    worker.on("error", (error) => reject(error));

    worker.on("exit", () => {
      completedTasks++;
      console.log(`Worker processed batch ${start} - ${end}`);
      if (completedTasks === numWorkers) {
        writeFileSync(`./vectors.json`, JSON.stringify(vectors));
        console.log("All processing complete");
      }
      resolve();
    });
  });
};

// Divide work among workers
const batchSize = Math.ceil(mnist.length / numWorkers);
const promises = [];

for (let i = 0; i < numWorkers; i++) {
  const start = i * batchSize;
  const end = Math.min(start + batchSize, mnist.length);
  promises.push(processBatch(start, end));
}

Promise.all(promises).then(() => {
  console.log("All batches dispatched");
});
