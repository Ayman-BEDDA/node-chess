import fs from "fs/promises";
import path from "path";
import Sequelize from "sequelize";
const connection = new Sequelize(process.env.DATABASE_URL);
const db = {
  connection,
};

fs.readdir(path.join(__dirname, "models"))
  .then((files) =>
    Promise.all(
      files.map((file) => import(path.join(__dirname, "models", file)))
    )
  )
  .then((models) => {
    models.forEach((model) => {
      const { default: modelFn } = model;
      const modelInstance = modelFn(connection);
      db[modelInstance.name] = modelInstance;
    });
  });

export default db;
