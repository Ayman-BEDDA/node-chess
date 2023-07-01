const Sequelize = require("sequelize");

const connection = new Sequelize(process.env.DATABASE_URL);

connection
  .authenticate()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

module.exports = connection;
