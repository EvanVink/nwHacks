import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 3000;

const wss = new WebSocketServer({ port: PORT });

let clients = [];

wss.on("connection", ws => {
  clients.push(ws);
  console.log("Client connected");

  ws.on("message", message => {
    clients.forEach(client => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
    console.log("Client disconnected");
  });
});

console.log("Signaling server running on port " + PORT);
