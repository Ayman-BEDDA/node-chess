const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = function (connection) {
  class Report extends Model {}

  Report.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      message: {
        type: DataTypes.STRING(512),
        allowNull: false,
        validate: {
          len: [1, 320], // Minimum length of 1 and maximum length of 64 characters
        },
      },
      status: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: 'unread',
        validate: {
          len: [1, 64], // Minimum length of 1 and maximum length of 64 characters
        },
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
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      id_user_reported: {
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
      tableName: "reports",
    }
  );

  Report.associate = (models) => {
    Report.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
    Report.belongsTo(models.User, { foreignKey: 'id_user_reported', as: 'user_reported' });
  };

  return Report;
};
