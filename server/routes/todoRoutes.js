const express = require("express");
const router = express.Router();
const { getTodos, addTodo, updateTodo, deleteTodo } = require("../controllers/todoController");

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/", updateTodo);
router.delete("/", deleteTodo);

module.exports = router;
