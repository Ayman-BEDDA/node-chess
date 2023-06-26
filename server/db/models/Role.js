const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Role extends Model {}

  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      libelle: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
    },
    {
      sequelize: connection,
      tableName: "roles",
    }
  );

  return Role;
};