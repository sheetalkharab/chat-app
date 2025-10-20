import express from "express";
import cors from "cors";
import http from "http";
import { server as WebSocketServer } from "websocket";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ httpServer: server });

let messages = [];
let clients = [];
//websocket connection
webSocketServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  clients.push(connection);

  //if existing message send to new client
  connection.sendUTF(JSON.stringify({ command: "all-messages", messages }));
  connection.on("message", (message) => {
    const data = JSON.parse(message.utf8Data);
    if (data.command === "send-message") {
      const msg = {
        user: data.message.user || "Anonymous",
        text: data.message.text,
        time: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
      };
      messages.push(msg);
      //broadcast to all clients
      clients.forEach((client) =>
        client.sendUTF(JSON.stringify({ command: "new-message", message: msg }))
      );
    }
    //to like a message
    if (data.command === "like-message") {
      const index = data.index;
      if (messages[index]) {
        messages[index].likes += 1;
        clients.forEach((client) =>
          client.sendUTF(
            JSON.stringify({
              command: "update-message",
              message: messages[index],
              index,
            })
          )
        );
      }
    }
    //to dislike a message
    if (data.command === "dislike-message") {
      const index = data.index;
      if (messages[index]) {
        messages[index].dislikes += 1;
        clients.forEach((client) =>
          client.sendUTF(
            JSON.stringify({
              command: "update-message",
              message: messages[index],
              index,
            })
          )
        );
      }
    }
  });
  connection.on("close", () => {
    clients = clients.filter((c) => c !== connection);
  });
});

app.get("/", (req, res) => {
  res.json(messages); // send all messages as JSON
});

server.listen(PORT, () => {
  console.log(`WebSocket backend running on port ${PORT}`);
});
