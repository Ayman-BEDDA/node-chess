const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Money extends Model {}

  Money.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
    },
    {
      sequelize: connection,
      tableName: "moneys",
    }
  );

  return Money;
};