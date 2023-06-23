const { connection } = require("./db/db");

const mode = process.argv[2] ?? "alter";
connection.sync({ [mode]: true }).then(() => {
    console.log("Database synchronized");
    connection.close();
});