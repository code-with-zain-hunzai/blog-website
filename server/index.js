const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 7000;

app.use(cors());
app.use(express.json());

let todos = [];

function generateUniqueId() {
  return (
    "id-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
  );
} 

app.post("/todos", (req, res) => {
  const { todo, content, category, createAt,authorName } = req.body;

  if (!todo || !content || !category || !createAt || !authorName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newTodo = { 
    id: generateUniqueId(), 
    todo, 
    content, 
    category, 
    isStar: false,
    createAt,
    authorName
  };

  todos.push(newTodo);
  res.status(201).json({ message: "Todo added successfully", todo: newTodo });
});

app.get("/todos", (req, res) => {
  res.status(200).json({ data: todos });
});

app.get("/todos", (req, res) => {
  res.status(200).json({ data: todos });
});

app.put("/todos", (req, res) => {
  const { id } = req.body;

  let updatedTodo = null;
  todos = todos.map((t) => {
    if (t.id === id) {
      updatedTodo = { ...t, isStar: !t.isStar };
      return updatedTodo;
    }
    return t;
  });

  if (!updatedTodo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(200).json({ message: "Todo updated", todo: updatedTodo });
});

app.delete("/todos", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  let newTodos = todos.filter((todo) => todo.id !== id);
  if (newTodos.length === todos.length) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos = newTodos;
  res.status(200).json({ message: "Todo deleted successfully", todos });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
