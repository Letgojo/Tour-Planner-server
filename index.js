"use strict";

const express = require("express");
const http = require("http");
const boardRouter = require("./board");
const authRouter = require("./auth");
const locationRouter = require("./location");

const firestore = require("./firestore");

const { WebSocketServer } = require("ws");
const { constrainedMemory } = require("process");
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

const port = 8080;

app.use(express.json());

app.use("/", authRouter);
app.use("/board", boardRouter);
app.use("/location", locationRouter);

// firestore.getData("자연관광", "").then((result) => {
//   result.forEach((doc) => {
//     console.log(doc.data());
//   });
// });

const onSocketError = (error) => {
  console.log(error);
};

// server.on("upgrade", function (request, socket, head) {
//   socket.on("error", onSocketError);

//   socket.removeListener("error", onSocketError);

//   wss.handleUpgrade(request, socket, head, function (ws) {
//     wss.emit("connection", ws, request);
//   });
// });

server.on("upgrade", (request, socket, head) => {
  console.log("upgrade request approach!");
  socket.on("error", onSocketError);

  console.log(request);

  socket.removeListener("error", onSocketError);

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", function (ws, request) {
  ws.on("open", () => {
    console.log("opened!");
  });
  ws.on("error", console.error);

  ws.on("message", function (message) {
    console.log(`Received message ${message} from user`);
  });

  ws.on("close", () => {
    console.log("connection closed!");
  });
});

server.listen(port, function () {
  console.log("Listening on Port: ", port);
});
