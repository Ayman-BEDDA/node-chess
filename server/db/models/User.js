module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");
  const bcrypt = require("bcryptjs");
  const Friend = require("./Friend")(connection);
  const Buy = require("./Buy")(connection);
  const Move = require("./Move")(connection);
  const Own = require("./Own")(connection);
  const Report = require("./Report")(connection);
  const Game = require("./Game")(connection);

  class User extends Model {
    isPasswordValid(password) {
      return bcrypt.compare(password, this.password);
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
        allowNull: false,
        defaultValue: 2,
        references: {
            model: "roles",
        }
      }
    },
    {
      sequelize: connection,
      tableName: "users",
    }
  );

  function updatePassword(user) {
    return bcrypt.genSalt(10).then((salt) =>
      bcrypt.hash(user.password, salt).then((hash) => {
        user.password = hash;
      })
    );
  }

  User.addHook("beforeCreate", (user) => {
    return updatePassword(user);
  });

  User.addHook("beforeUpdate", async (user, options) => {
    if (options.fields.includes("password")) {
      return updatePassword(user);
    }
  });

  User.addHook("beforeDestroy", async (user) => {
    await Friend.destroy({
      where: {
        [Op.or]: [
          { id_user: user.id },
          { id_user_receiver: user.id }
        ]
      }
    });

    await Buy.destroy({
      where: {
        id_user: user.id
      }
    });

    await Move.destroy({
      where: {
        id_user: user.id
      }
    });

    await Own.destroy({
      where: {
        id_user: user.id
      }
    });

    await Report.destroy({
      where: {
        [Op.or]: [
          { id_user: user.id },
          { id_user_reported: user.id }
        ]
      }
    });

    await Game.destroy({
      where: {
        [Op.or]: [
          { WhiteUserID: user.id },
          { BlackUserID: user.id },
          { Winner: user.id }
        ]
      }
    });
  });

  return User;
};
