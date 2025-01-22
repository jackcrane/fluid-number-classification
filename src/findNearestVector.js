import { readFileSync } from "fs";

export const findNearestVectors = (vector, k = 4) => {
  const rawVectors = JSON.parse(readFileSync("./vectors.json", "utf8"));
  const vectors = rawVectors.map((v) => v.vector);

  const distances = vectors.map((v, index) => ({
    vector: rawVectors[index],
    distance: Math.sqrt(
      v.reduce((acc, val, idx) => acc + (val - vector[idx]) ** 2, 0)
    ),
  }));

  // Sort by distance and take the top `k` nearest vectors
  distances.sort((a, b) => a.distance - b.distance);
  const nearestVectors = distances.slice(0, k);

  return nearestVectors;
};

export const findNearestVector = (vector, k = 5) => {
  const nearestVectors = findNearestVectors(vector, k);

  const characters = nearestVectors.map((v) => v.vector.character);
  const counts = characters.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  const mostCommonCharacter = Object.entries(counts).reduce(
    (maxKey, [key, value]) => (value > counts[maxKey] ? key : maxKey),
    Object.keys(counts)[0]
  );

  return {
    nearestVector: {
      character: mostCommonCharacter,
    },
  };
};
