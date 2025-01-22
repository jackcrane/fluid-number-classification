import { load } from "./load.js";
import { Worker } from "worker_threads";
import { rmSync, mkdirSync, writeFileSync } from "fs";

rmSync("./images", { recursive: true });
mkdirSync("./images");

const allmnist = load();
// first 1000
const mnist = allmnist;

const vectors = new Array(mnist.length);
const numWorkers = 4; // Adjust based on your CPU cores
let completedTasks = 0;

const startTime = performance.now();
const processBatch = (start, end) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./src/worker.js", {
      workerData: { images: mnist.slice(start, end), startIndex: start },
    });

    worker.on("message", (message) => {
      if (message.type === "progress") {
        // console.log(`Worker progress: ${message.message}`);
      } else if (message.type === "result") {
        const { index, vector } = message;
        vectors[index] = vector;
      } else if (message.type === "done") {
        console.log(message.message);
        completedTasks++;
        if (completedTasks === numWorkers) {
          writeFileSync(`./vectors.json`, JSON.stringify(vectors));
          const endTime = performance.now();
          console.log(`All processing complete, took ${endTime - startTime}ms`);
        }
        resolve();
      }
    });

    worker.on("error", (error) => reject(error));
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
