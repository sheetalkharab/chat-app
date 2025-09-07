import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3000;

// Middleware
let messages = [];

// GET all messages
app.get("/messages", (req, res) => {
  res.json(messages);
});

// POST a new message
app.post("/messages", (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ error: "User and text are required" });
  }
  const message = { user, text, time: new Date().toISOString() };
  messages.push(message);
  res.status(201).json(message);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
