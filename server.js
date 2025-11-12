import express from "express";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 10000;
const app = express();

// Serve a simple status page
app.get("/", (req, res) => res.send("🌐 Streetlight WebSocket Gateway Running"));

// Create WebSocket server
const server = app.listen(PORT, () => console.log(`Server on port ${PORT}`));
const wss = new WebSocketServer({ server });

let clients = [];

wss.on("connection", (ws, req) => {
  console.log("New WebSocket connection");
  clients.push(ws);

  ws.on("message", (msg) => {
    console.log("📨 Received:", msg.toString());

    // Broadcast message to all others (dashboard + ESPs)
    clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) client.send(msg.toString());
    });
  });

  ws.on("close", () => {
    console.log("🔌 WebSocket disconnected");
    clients = clients.filter((c) => c !== ws);
  });
});
