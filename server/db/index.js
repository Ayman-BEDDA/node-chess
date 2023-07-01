const connection = require("./db");
const fs = require("fs");
const path = require("path");

const db = { connection };

const files = fs.readdirSync(path.join(__dirname, "models"));
files.forEach((file) => {
  const model = require(path.join(__dirname, "models", file))(connection);
  db[model.name] = model;
});

module.exports = db;
