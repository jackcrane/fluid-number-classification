import { readFileSync, writeFileSync } from "fs";

export const logTimings = (key, startTime, endTime) => {
  return;
  let timings = JSON.parse(readFileSync("./timings.json", "utf8"));

  const processId = process.pid;
  if (timings.processId !== processId) {
    console.log("New process, dumping timings");
    timings = {
      processId,
    };
  }

  if (timings[key]) {
    const { value, entries } = timings[key];

    const averageAddend = value * entries;
    const newAverage = (averageAddend + (endTime - startTime)) / (entries + 1);

    timings[key] = {
      value: newAverage,
      entries: entries + 1,
    };
  } else {
    timings[key] = { value: endTime - startTime, entries: 1 };
  }

  writeFileSync("./timings.json", JSON.stringify(timings, null, 2));
};
