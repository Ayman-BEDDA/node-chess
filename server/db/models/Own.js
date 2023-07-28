const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = function (connection) {
  class Own extends Model {}

  Own.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_money: {
        type: DataTypes.UUID,
        references: {
          model: 'moneys',
          key: 'id', 
        }
      },
      id_user: {
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
      tableName: "owns",
    }
  );

  Own.associate = (models) => {
    Own.belongsTo(models.Money, { foreignKey: 'id_money', as: 'money' });
    Own.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
  };

  return Own;
};
