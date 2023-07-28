require("dotenv").config();
const express = require("express");
const app = express();
const http = require('http');
const UserRouter = require("./routes/user");
const ReportRouter = require("./routes/report");
const GameRouter = require("./routes/game");
const SecurityRouter = require("./routes/security");
const RoleRouter = require("./routes/role");
const ArticleRouter = require("./routes/article");
const MoneyRouter = require("./routes/money");
const FriendRouter = require("./routes/friend");
const OwnRouter = require("./routes/own");
const BuyRouter = require("./routes/buy");
const ValidationError = require("./errors/ValidationError");
const cors = require("cors");
const checkFormat = require("./middlewares/check-format");
const errorHandler = require("./middlewares/error-handler");
const checkAuth = require("./middlewares/check-auth");
const checkAdmin  = require("./middlewares/check-role");
const checkValidation = require("./middlewares/check-validation");
const checkNotBan = require("./middlewares/check-not-banned");
const setupGame = require('./gameManager');
const bodyParser = require("body-parser");
const port = process.env.NODE_ENV === 'test' ? 3005 : 3000;
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const mongoose = require("mongoose");
// multer <3
const multer = require('multer');
const upload = multer({ dest: 'public/' });

async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://root:password@mongo:27017", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
    );

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

app.use(cors());

app.use(checkFormat);

app.use(bodyParser.json({ limit: '50mb' }));

app.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('No image provided');
    }

    const image = req.file;
    const imageExtension = path.extname(image.originalname).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

    if (!allowedExtensions.includes(imageExtension)) {
      throw new ValidationError('Invalid image format. Allowed formats: ' + allowedExtensions.join(', '));
    }

    const formattedDate = dayjs().format('YYYY-MM-DD_HH:mm');
    const finalImageName = `${formattedDate}_${image.originalname}`;

    fs.renameSync(image.path, path.join('public', finalImageName));

    res.status(201).json({ message: 'Image uploaded successfully', imageName: finalImageName });
  } catch (error) {
    next(error);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use("/", SecurityRouter);
//app.use(checkAuth); protect all routes below
app.use("/users", UserRouter); // protect only this route
app.use("/reports", checkAuth, ReportRouter); // protect only this route
app.use("/roles", RoleRouter); // protect only this route
app.use("/articles", checkAuth, checkValidation, checkNotBan, ArticleRouter);
app.use("/moneys", checkAuth, MoneyRouter);
app.use("/owns", checkAuth, OwnRouter);
app.use("/games",  GameRouter); // protect only this route
app.use("/buys", checkAuth, BuyRouter);
app.use("/friends", FriendRouter); //Friend

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);


const server = http.createServer(app);

setupGame(server);

server.listen(port, () => {
  console.log("Server running on port " + port);
});

module.exports = server;