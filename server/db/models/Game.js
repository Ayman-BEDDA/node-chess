const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Game extends Model {}

  Game.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      WhiteUserID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', 
          key: 'id', 
        },
        onDelete: 'CASCADE'
      },
      BlackUserID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', 
          key: 'id', 
        },
        onDelete: 'CASCADE'
      },
      GameStatus: {
        type: DataTypes.STRING(32),
      },
      Winner: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users', 
          key: 'id', 
        },
        onDelete: 'CASCADE'
      },
    },
    {
      sequelize: connection,
      tableName: "games",
    }
  );

  return Game;
};
