# Fluid Number Classification

![Fluid Number Classification header](./doc/header.png)

> Heavily inspired by the video [Can Water Recognize Numbers? | KNN Digit Recognizer](https://youtu.be/CC4G_xKK2g8?si=6xTBuhwJq0d2OTho) by PickentCode.

This project is my first legit adventure into machine learning and computer vision. I wanted to do it right and learn starting at the ground floor before getting into frameworks like TensorFlow. I understand the equivalent of the "hello world" project in machine learning is to classify a handwritten digit, so I downloaded the MNIST dataset and got started.

Here is the journey.

<!-- <img src="input.png" width="400" height="400" style="image-rendering: pixelated; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor;"> -->

## Section 0: improving rendering of this readme

Run the following code in your browser console on this page to improve the rendering of a few images.

```js
['ffl0f', 'ffl90f', 'ffl180f', 'ffl270f'].map(id => {
  const img = document.querySelector(`#user-content-${id}`);
  img.style.maxWidth = "200px";
  img.style.imageRendering = "pixelated";
})
```

## Getting Started: Aquiring and ingesting the Data

I downloaded the MNIST dataset from Kaggle and extracted the images and labels. This left me with 4 files:

```bash
% tree
.
├── t10k-images.idx3-ubyte
├── t10k-labels.idx1-ubyte
├── train-images.idx3-ubyte
└── train-labels.idx1-ubyte
```

Then I created the [`src/load.js`](./src/load.js) file to convert the files from their binary format into javascript friendly data. The output of this function looks like:

```json
[
  {
    '2': [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0,
      ... 684 more items
    ]
  },
]
```

Each pixel value falls between [0, 255]. This left me with a very long 1x784 array. I reshaped this array into a 28x28 array of pixels in the [`src/reshapeArray.js`](./src/reshapeArray.js) file.

At this point, I was able to load the data and parse it into images.

<!-- 67x10 grid of images -->

![mnist number grid](./doc/mnist-numbers.png)

## Flood Filling

The next step was to implement a flood fill algorithm. Originally I wrote a depth-first ff algorithm, but switched to breadth-first because it would generate a better looking result animation. This [algorithm](./src/floodFillLetter.js) is nothing novel so it is linked and won't be further covered.

https://github.com/user-attachments/assets/6880634a-8c8e-4883-816c-4d9743ee2098

Next, we need to find out how many pixels are filled in as "liquid". This will be one of the inputs to our final vector. This image (number `4` in the mnist dataset) has 670 pixels filled in this test. Our final vector is now:

$$
\langle
\color{forestgreen}670
\color{white},
\color{yellow}?
\color{white},
\color{yellow}?
\color{white},
\color{orange}?
\color{white},
\color{orange}?
\color{white},
\color{teal}?
\color{white},
\color{teal}?
\color{white},
\color{red}?
\color{white},
\color{red}?
\color{white}
\rangle
$$

## Limited Flood Fill

We will now use a limited flood fill algorithm to simulate pouring liquid into the image from the top. Basically we will restrict the fluid from traveling upwards, then we will run the same flood fill algorithm as before. Then, we will rotate the image 90 degrees and repeat the process. Rotate it again, and repeat. We will capture the result of the 4 orientations, and serve them as inputs to our final vector. Additionally, to account for the fact that some numbers will have an unbalanced distribution of filled pixels (think a 6 rotated 90 degrees counter clockwise will catch a lot of liquid in the curved bit) we are splitting the number of filled pixels down the middle:

```js
const numFilledPixelsFirstHalf = flooded.reduce(
  (acc, arr) => acc + arr.slice(0, Math.floor(arr.length / 2)).filter((x) => x).length,
  0
);

const numFilledPixelsSecondHalf = flooded.reduce(
  (acc, arr) => acc + arr.slice(Math.floor(arr.length / 2)).filter((x) => x).length,
  0
);
```

Starting with the original orientation, when we restrict the floodfill from traversing upward, we get only 2 pixels that don't get filled in:

<table>
<tr>
<td>

<img src="./doc/floodfill-limited-0.png" height='200'>

</td>
<td>

<img id="ffl0f" src="./doc/floodfill-limited-0-frame.png" height='200' width='200' style="image-rendering: pixelated; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor;"/>

</td>
</tr>
</table>

so the total is 668 (326 + 342), so we will add to our vector:

$$
\langle
\color{forestgreen}670
\color{white},
\color{yellow}336
\color{white},
\color{yellow}342
\color{white},
\color{orange}?
\color{white},
\color{orange}?
\color{white},
\color{teal}?
\color{white},
\color{teal}?
\color{white},
\color{red}?
\color{white},
\color{red}?
\color{white}
\rangle
$$

<table>
<tr>
<td>
90 degrees

316, 354

</td>
<td>

<img src="./doc/floodfill-limited-90.png" height='200'>

</td>
<td>

<img id="ffl90f" src="./doc/floodfill-limited-90-frame.png" height='200' width='200' style="image-rendering: pixelated; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor;"/>

</td>
</tr>
<tr>
<td>
180 degrees

334, 324

</td>
<td>

<img src="./doc/floodfill-limited-180.png" height='200'>

</td>
<td>

<img id="ffl180f" src="./doc/floodfill-limited-180-frame.png" height='200' width='200' style="image-rendering: pixelated; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor;"/>

</td>
</tr>
<tr>
<td>
270 degrees

354, 298

</td>
<td>

<img src="./doc/floodfill-limited-270.png" height='200'>

</td>
<td>

<img id="ffl270f" src="./doc/floodfill-limited-270-frame.png" height='200' width='200' style="image-rendering: pixelated; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor;"/>

</td>
</tr>
</table>

Finally, this heeds our final vector for this sample:

$$
\langle
\color{forestgreen}670
\color{white},
\color{yellow}336
\color{white},
\color{yellow}342
\color{white},
\color{orange}316
\color{white},
\color{orange}354
\color{white},
\color{teal}334
\color{white},
\color{teal}324
\color{white},
\color{red}354
\color{white},
\color{red}298
\color{white}
\rangle
$$

## Iterative execution

Now all that was left was to drop everything in a reusable function

```js
export const generateLetterVector = (imageData) => {
  const vector = [];

  let [, buoyancy] = floodFillLetter(imageData, false, 0);
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
```

Then drop that into a loop:

```js
let vectors = [];

for (let i = 0; i < mnist.length; i++) {
  const startTime = performance.now();
  const imageData = mnist[i];
  const vector = generateLetterVector(imageData);
  vectors[i] = vector;
  const endTime = performance.now();

  console.log(vector.character, i, endTime - startTime);

  if (i % 10 === 0) {
    writeFileSync(`./vectors.json`, JSON.stringify(vectors));
  }
}
```

...and discover it will take over 2 hours to execute.

Not a problem! I can dispatch them in parallel and get that down to... 14 seconds including javascript spin-up time, so ill take it.

Now, I have all my data in a giant JSON file

```json
[
  { "character": "5", "vector": [673, 336, 333, 313, 294, 333, 339, 347, 290] },
  { "character": "0", "vector": [565, 292, 273, 252, 313, 273, 292, 313, 252] },
  { "character": "4", "vector": [703, 361, 331, 340, 361, 335, 269, 358, 338] },
  { "character": "1", "vector": [718, 365, 353, 354, 364, 353, 365, 364, 354] },
  { "character": "9", "vector": [670, 326, 342, 316, 354, 344, 324, 354, 298] },
  { "character": "2", "vector": [658, 339, 298, 298, 322, 310, 348, 338, 318] },
  { "character": "1", "vector": [717, 362, 355, 331, 386, 355, 362, 386, 331] },
  { "character": "3", "vector": [641, 322, 319, 265, 305, 312, 322, 344, 297] },
  { "character": "1", "vector": [739, 372, 367, 347, 392, 367, 372, 392, 347] },
  { "character": "4", "vector": [697, 354, 336, 337, 347, 340, 326, 360, 333] },
  { "character": "3", "vector": [675, 334, 340, 295, 343, 329, 334, 364, 307] },
  { "character": "5", "vector": [726, 362, 364, 357, 364, 356, 362, 368, 352] },
  { "character": "3", "vector": [640, 326, 313, 268, 269, 301, 326, 340, 290] },
  ...60,000 more rows
]
```

## Finding the nearest vector

Once we have our dictionary of vectors, we have to find the nearest vector to our current one. This is done using the euclidean distance formula (an expanded version of the pythagorean theorem):

$$
\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2 + (z_1 - z_2)^2}
$$

My implementation is in [`./src/findNearestVector.js`](./src/findNearestVector.js). It is a simple loop that iterates over all vectors in the dictionary and calculates the distance between the current vector and each vector. It then returns the vector with the smallest distance.

It finds the nearest vector and the distance to it, ultimately providing the solution to our query.

By running it against the test data, we get an accurate solution rate of 78.81% ([7881 passes and 2119 failures](./benchmark.txt)), which for my first attempt, ill take it.

## Migration to KNN

For the sake of time efficiency, I am using 200 samples from the MNIST test dataset rather than all 10,000 for testing. Given these first 200 samples, I am getting an 81% pass rate with 162 successes and 38 failures. Migrating to the KNN algorithm is the next step and I need to decide how many nearest vectors to use.

| Number of nearest vectors | Pass rate | Comment |
| ------------------------- | --------- | ------- |
| 1 | 81% | This is the same as the current implementation, finding the single nearest vector |
| 2 | 83% | |
| 3 | 83.5% | |
| 4 | 83.17% | |
| 5 | 85.00% | The best! |
| 6 | 84.25% | |
| 7 | 84.00% | |
| 8 | 83.75% | |
| 9 | 83.90% | |
| 10 | 84.00% | |

So looks like the most accurate solution is with 5 nearest vectors so I am going to use that for now. Running it against the entire 10,000 test images, we got an 81.28% pass rate with 8128 successes and 1872 failures.

Looking deeper into these failures, I ran the benchmark against 1000 images and counted how many times each character failed.

| Character | Failures | Graph |
| --------- | -------- | ----- |
| 0 | 14 | ██████████████ |
| 1 | 13 | █████████████ |
| 2 | 30 | ██████████████████████████████ |
| 3 | 39 | ███████████████████████████████████████ |
| 4 | 13 | █████████████ |
| 5 | 28 | ████████████████████████████ |
| 6 | 14 | ██████████████ |
| 7 | 21 | █████████████████████ |
| 8 | 19 | ███████████████████ |
| 9 | 16 | ████████████████ |

The distribution of errors is interesting to me, especially the high rate for the characters `2`, `3`, and `5`. I am curious about other options on improving the accuracy of the model especially on these characters.

## Falloff

I tried to implement a falloff function to the flood fill, hopefully giving me a way to encode not only whether a pixel is filled, but how "out of the way" it is, so I updated the floodfill algorithm to cool the pixels down as they are filled:

## Moving forward

Now that I have a working solution, I have a few ideas for how to improve it:

- Using more fluid regions in the image processing. Right now it just uses the 2 halves, I think if I could split it into 4 sections, I could get better results given the trade off of my model being larger.
- Increasing the horizontal flow "viscosity" of the fluid to prevent it from filling in areas as completely. (possibly making it only able to move horizontally at half the rate of the vertical flow)

I am very happy with how it is working now, but obviously there is room for improvement.