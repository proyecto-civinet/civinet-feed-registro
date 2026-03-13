const express    = require("express");
const cors       = require("cors");
const feedRoutes = require("./routes/feedRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

app.use("/api", feedRoutes);

module.exports = app;