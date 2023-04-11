"use strict";

const express = require("express");
const http = require("http");
const boardRouter = require("./board");
const authRouter = require("./auth");

const { WebSocketServer } = require("ws");
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

app.use(express.json());

app.use("/", authRouter);
app.use("/board", boardRouter);

// server.on("upgrade", function (request, socket, head) {
//   socket.on("error", onSocketError);

//   socket.removeListener("error", onSocketError);

//   wss.handleUpgrade(request, socket, head, function (ws) {
//     wss.emit("connection", ws, request);
//   });
// });

wss.on("connection", function (ws, request) {
  const userId = request.session.userId;

  map.set(userId, ws);

  ws.on("error", console.error);

  ws.on("message", function (message) {
    console.log(`Received message ${message} from user ${userId}`);
  });

  ws.on("close", function () {
    map.delete(userId);
  });
});

server.listen(50020, function () {
  console.log("Listening on Port 50020");
});
