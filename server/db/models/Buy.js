const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Buy extends Model {}

  Buy.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      id_article: {
        type: DataTypes.INTEGER,
        references: {
          model: 'articles',
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
      tableName: "buys",
    }
  );

  return Buy;
};