import { WebSocketServer } from "ws";
import { generateLetterVector } from "./generateLetterVector.js";
import { findNearestVector } from "./findNearestVector.js";
import { unReshapeArray } from "./reshapeArray.js";
import { generateLetterImage } from "./generateLetterImage.js";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const { imageData } = JSON.parse(message);
    const { vector } = generateLetterVector({ 0: unReshapeArray(imageData) });
    generateLetterImage(
      { 0: unReshapeArray(imageData) },
      {
        writeImage: true,
        idx: "nearest",
      }
    );
    const nearest = findNearestVector(vector);
    console.log(nearest);
    // Respond with the nearest vector
    ws.send(nearest.nearestVector.character);
  });
});

console.log("WebSocket server running on ws://localhost:8080");
