const {Model, DataTypes} = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = function (connection) {
    class Buy extends Model {
    }

    Buy.init({
        id: {
          type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
        },
        date: {
            type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
        },
        id_article: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'articles', 
              key: 'id', 
            },
            onDelete: 'CASCADE'
        },
        id_user: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'users', 
              key: 'id', 
            },
            onDelete: 'CASCADE'
        },
    }, {
        sequelize: connection, tableName: "buys",
    });

  Buy.associate = (models) => {
    Buy.belongsTo(models.Article, { foreignKey: 'id_article', as: 'article' });
    Buy.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
  };

    return Buy;
};