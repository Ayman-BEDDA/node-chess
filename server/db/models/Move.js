const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Move extends Model {}

  Move.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fromSquare: {
        type: DataTypes.STRING(16),
      },
      toSquare: {
        type: DataTypes.STRING(16),
      },
      nbMove: {
        type: DataTypes.INTEGER,
      },
      id_game: {
        type: DataTypes.INTEGER,
        references: {
          model: 'games',
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
      tableName: "moves",
    }
  );

  Move.associate = (models) => {
    Move.belongsTo(models.Game, { foreignKey: 'id_game', as: 'game' });
    Move.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
  };

  return Move;
};
