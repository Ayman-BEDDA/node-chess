const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Report extends Model {}

  Report.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      message: {
        type: DataTypes.STRING(512),
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: 'unread'
      },
      onCreate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      onUpdate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      id_user: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      id_user_reported: {
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
      tableName: "reports",
    }
  );

  return Report;
};
