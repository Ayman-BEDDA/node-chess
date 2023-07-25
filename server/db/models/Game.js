const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = function (connection) {
  class Game extends Model {}

  Game.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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

  Game.associate = (models) => {
    Game.belongsTo(models.User, { foreignKey: 'WhiteUserID', as: 'whiteUser' });
    Game.belongsTo(models.User, { foreignKey: 'BlackUserID', as: 'blackUser' });
    Game.belongsTo(models.User, { foreignKey: 'Winner', as: 'winnerUser' });
    Game.hasMany(models.Move, { foreignKey: 'id_game', as: 'moves' });
  };

  return Game;
};
