const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Friend extends Model {}

  Friend.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      status: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: 'waiting'
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      id_user: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      id_user_receiver: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }
      },
    },
    {
      sequelize: connection,
      tableName: "friends",
    }
  );

  return Friend;
};
