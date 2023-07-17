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
