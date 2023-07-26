const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = function (connection) {
  class Money extends Model {}

  Money.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
    },
    {
      sequelize: connection,
      tableName: "moneys",
    }
  );

  Money.associate = (models) => {
    Money.hasMany(models.Own, { foreignKey: 'id_money', as: 'owns' });
    Money.hasMany(models.Article, { foreignKey: 'id_money', as: 'articles' });
  }

  return Money;
};
