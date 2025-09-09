import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware
let messages = [];

// GET all messages
app.get("/messages", (req, res) => {
  res.json(messages);
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
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
