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
        type: DataTypes.UUID,
        references: {
          model: 'users', 
          key: 'id', 
        },
        onDelete: 'CASCADE'
      },
      BlackUserID: {
        type: DataTypes.UUID,
        references: {
          model: 'users', 
          key: 'id', 
        },
        onDelete: 'CASCADE'
      },
      GameStatus: {
        type: DataTypes.STRING(32),
        validate: {
          len: [1, 64], // Minimum length of 1 and maximum length of 64 characters
        },
      },
      Winner: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users', 
          key: 'id', 
        },
        onDelete: 'CASCADE'
      },
      fen: {
        type: DataTypes.STRING,
        defaultValue: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
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