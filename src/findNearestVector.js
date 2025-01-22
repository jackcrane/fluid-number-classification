import { readFileSync } from "fs";

export const findNearestVector = (vector) => {
  const rawVectors = JSON.parse(readFileSync("./vectors.json", "utf8"));
  const vectors = rawVectors.map((v) => v.vector);

  let nearestVector = null;
  let nearestDistance = Infinity;

  for (let i = 0; i < vectors.length; i++) {
    const currentDistance = Math.sqrt(
      vectors[i].reduce((acc, val, idx) => acc + (val - vector[idx]) ** 2, 0)
    );

    if (currentDistance < nearestDistance) {
      nearestVector = rawVectors[i];
      nearestDistance = currentDistance;
    }
  }

  return { nearestVector, nearestDistance };
};
