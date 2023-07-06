const express = require("express");
const app = express();
const UserRouter = require("./routes/user");
const ReportRouter = require("./routes/report");
const GameRouter = require("./routes/game");
const SecurityRouter = require("./routes/security");
const ValidationError = require("./errors/ValidationError");
const cors = require("cors");
const checkFormat = require("./middlewares/check-format");
const errorHandler = require("./middlewares/error-handler");
const checkAuth = require("./middlewares/check-auth");

app.use(cors());

app.use(checkFormat);

app.use(express.json());
app.use("/", SecurityRouter);
// app.use(checkAuth); -> protect every routes below
app.use("/users", checkAuth, UserRouter); // protect only this route
app.use("/reports", checkAuth, ReportRouter); // protect only this route
app.use("/games", checkAuth, GameRouter); // protect only this route

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
