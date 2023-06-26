const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class User extends Model {
    async checkPassword(password) {
      const bcrypt = require("bcryptjs");
      return bcrypt.compare(password, this.password);
    }

    generateToken() {
      const jwt = require("jsonwebtoken");
      return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: "1y",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      login: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(320),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          isNotNull: function (value) {
            if (value === null) {
              throw new Error("Email cannot be null");
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
          //min: 8,
          //is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        },
      },
      elo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 500
      },
      media: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: "default.png"
      },
      isBanned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      id_role: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles',
          key: 'id',
        }
      },
    },
    {
      sequelize: connection,
      tableName: "users",
    }
  );

  async function encryptPassword(user, options) {
    if (!options?.fields.includes("password")) {
      return;
    }
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }

  User.addHook("beforeCreate", encryptPassword);
  User.addHook("beforeUpdate", encryptPassword);

  return User;
};
