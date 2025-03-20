const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  todo: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  isStar: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  authorName: { type: String, required: true },
});

module.exports = mongoose.model("Todo", TodoSchema);
