const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Article extends Model {}

  Article.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      libelle: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      media: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      id_money: {
        type: DataTypes.INTEGER,
        references: {
          model: 'moneys',
          key: 'id',
        }
      },
    },
    {
      sequelize: connection,
      tableName: "articles",
    }
  );

  return Article;
};
