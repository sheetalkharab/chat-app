import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware
let messages = [];
let waitingClients = []; // store waiting get requests for long polling

// GET all messages
app.get("/messages", (req, res) => {
  //optionally allow client to ask since last message time
  const since = req.query.since ? new Date(req.query.since) : null;
  let newMessages = messages;
  if (since) {
    newMessages = messages.filter((msg) => new Date(msg.time) > since);
  }
  if (newMessages.length === 0) {
    waitingClients.push(res);
    setTimeout(() => {
      const index = waitingClients.indexOf(res);
      if (index !== -1) {
        waitingClients.splice(index, 1);
        res.json([]); //send empty array
      }
    }, 30000);
  } else {
    res.json(newMessages);
  }
});

// POST a new message
app.post("/messages", (req, res) => {
  let { user, text } = req.body;
  if (!user || user.trim() === "") {
    user = "Anonymous";
  }
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }
  const message = { user, text, time: new Date().toISOString() };
  messages.push(message);
  res.status(201).json(message);

  //notify all waiting clients
  while (waitingClients.length > 0) {
    const clientRes = waitingClients.pop();
    clientRes.json([message]);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
