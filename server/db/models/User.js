module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");
  const { v4: uuidv4 } = require('uuid');
  const bcrypt = require("bcryptjs");
  const Friend = require("./Friend")(connection);
  const Buy = require("./Buy")(connection);
  const Move = require("./Move")(connection);
  const Own = require("./Own")(connection);
  const Report = require("./Report")(connection);
  const Game = require("./Game")(connection);
  const Role = require("./Role")(connection);

  class User extends Model {
    isPasswordValid(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      lastDailyRewardDate: {
            type: DataTypes.DATE,
            allowNull: true, // ou false si vous souhaitez que la date de dernière connexion soit obligatoire
      },
      id_role: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        references: {
            model: "roles",
        }
      },
      token: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: "users",
    }
  );

User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: 'id_role', as: 'role' });
  User.hasMany(models.Game, { foreignKey: 'WhiteUserID', as: 'whiteUser' });
  User.hasMany(models.Game, { foreignKey: 'BlackUserID', as: 'blackUser' });
  User.hasMany(models.Game, { foreignKey: 'Winner', as: 'winnerUser' });
  User.hasMany(models.Friend, { foreignKey: 'id_user', as: 'user' });
  User.hasMany(models.Friend, { foreignKey: 'id_user_receiver', as: 'userReceiver' });
  User.hasMany(models.Move, { foreignKey: 'id_user', as: 'moveUser' });
  User.hasMany(models.Report, { foreignKey: 'id_user', as: 'reportUser' });
  User.hasMany(models.Report, { foreignKey: 'id_user_reported', as: 'reportedUser' });
  User.hasMany(models.Own, { foreignKey: 'id_user', as: 'ownUser' });
  User.hasMany(models.Buy, { foreignKey: 'id_user', as: 'buyUser' });
};

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

  User.addHook("beforeCreate", async (user) => {
    try {
      const roles = await Role.findAll({ limit: 2 });
      if (roles.length >= 2) {
        user.id_role = roles[1].id;
      } else {
        throw new Error("Not enough roles found in the 'roles' table.");
      }
    } catch (error) {
      console.error("Error setting default role:", error);
    }
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
