const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/todos", require("./routes/todoRoutes"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
