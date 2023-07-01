const db = require("./db");

const mode = process.argv[2] ?? "alter";

db.connection
  .sync({ [mode]: true })
  .then(() => console.log("Database synchronized"))
  .then(() => db.connection.close());
