require("dotenv").config();
const express = require("express");
const app = express();
const UserRouter = require("./routes/user");
const ReportRouter = require("./routes/report");
const GameRouter = require("./routes/game");
const SecurityRouter = require("./routes/security");
const RoleRouter = require("./routes/role");
const ArticleRouter = require("./routes/article");
const MoneyRouter = require("./routes/money");
const FriendRouter = require("./routes/friend");
const OwnRouter = require("./routes/own");
const ValidationError = require("./errors/ValidationError");
const cors = require("cors");
const checkFormat = require("./middlewares/check-format");
const errorHandler = require("./middlewares/error-handler");
const checkAuth = require("./middlewares/check-auth");
const checkAdmin  = require("./middlewares/check-role");
const checkValidation = require("./middlewares/check-validation");
const checkNotBan = require("./middlewares/check-not-banned");

app.use(cors());

app.use(checkFormat);


app.use(express.json());
app.use("/", SecurityRouter);
//app.use(checkAuth); protect all routes below
app.use("/users", UserRouter); // protect only this route
app.use("/reports", checkAuth, ReportRouter); // protect only this route
app.use("/roles", checkAuth, checkAdmin, RoleRouter); // protect only this route
app.use("/articles", checkAuth, checkValidation, checkNotBan, ArticleRouter);
app.use("/moneys", checkAuth, checkAdmin, MoneyRouter);
app.use("/owns", checkAuth, OwnRouter);
app.use("/games", checkAuth, GameRouter); // protect only this route
app.use("/friends", FriendRouter); //Friend

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
