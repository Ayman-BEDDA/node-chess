const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = function (connection) {
  class Friend extends Model {}

  Friend.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      status: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: 'waiting'
      },
      id_user: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      id_user_receiver: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
    },
    {
      sequelize: connection,
      tableName: "friends",
    }
  );

  Friend.associate = (models) => {
    Friend.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
    Friend.belongsTo(models.User, { foreignKey: 'id_user_receiver', as: 'user_receiver' });
  };

  return Friend;
};
