// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
let todos = [];
let id = 1;

// Get all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// Add a new todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }
  const newTodo = { id: id++, text, done: false };
  todos.push(newTodo);
  res.json(newTodo);
});

// Update a todo (toggle done or edit text)
app.put("/api/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const { done, text } = req.body;

  const todo = todos.find((t) => t.id === todoId);
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  if (done !== undefined) todo.done = done;
  if (text !== undefined) todo.text = text;

  res.json(todo);
});

// Delete a todo
app.delete("/api/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  todos = todos.filter((t) => t.id !== todoId);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
