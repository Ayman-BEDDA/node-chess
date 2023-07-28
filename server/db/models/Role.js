const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = function (connection) {
  class Role extends Model {}

  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      libelle: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          len: [1, 64], // Minimum length of 1 and maximum length of 64 characters
        },
      },
    },
    {
      sequelize: connection,
      tableName: "roles",
    }
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'id_role', as: 'users' });
  }
  
  return Role;
};
