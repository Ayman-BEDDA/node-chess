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
        }
      },
      BlackUserID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', 
          key: 'id', 
        }
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
        }
      },
    },
    {
      sequelize: connection,
      tableName: "games",
    }
  );

  Game.associate = (models) => {
    Game.belongsTo(models.User, { foreignKey: 'WhiteUserID', as: 'whiteUser' });
    Game.belongsTo(models.User, { foreignKey: 'BlackUserID', as: 'blackUser' });
    Game.belongsTo(models.User, { foreignKey: 'Winner', as: 'winnerUser' });
    Game.hasMany(models.Move, { foreignKey: 'id_game', as: 'moves' });
  };

  return Game;
};
