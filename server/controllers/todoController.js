const Todo = require("../models/Todo");

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({ data: todos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addTodo = async (req, res) => {
  const { todo, content, category, authorName } = req.body;
  if (!todo || !content || !category || !authorName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newTodo = await Todo.create({ todo, content, category, authorName });
    res.status(201).json({ message: "Todo added successfully", todo: newTodo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTodo = async (req, res) => {
  const { id } = req.body;
  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    todo.isStar = !todo.isStar;
    await todo.save();
    res.status(200).json({ message: "Todo updated", todo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  const { id } = req.body;
  try {
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTodos, addTodo, updateTodo, deleteTodo };
