const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Own extends Model {}

  Own.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_money: {
        type: DataTypes.INTEGER,
        references: {
          model: 'moneys',
          key: 'id', 
        }
      },
      id_user: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }
      },
    },
    {
      sequelize: connection,
      tableName: "owns",
    }
  );

  return Own;
};
