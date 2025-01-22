export const rotateArray = (input) => {
  if (
    !Array.isArray(input) ||
    input.length !== 28 ||
    input.some((row) => row.length !== 28)
  ) {
    throw new Error("Invalid input: Expected a 28x28 array");
  }

  const rotated = Array.from({ length: 28 }, () => Array(28).fill(0));

  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      rotated[j][27 - i] = input[i][j];
    }
  }

  return rotated;
};
