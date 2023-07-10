const { User, Game, Friend, Article, Buy} = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function UserService() {
  return {
    findAll: async function (filters, options) {
      let dbOptions = {
        where: filters,
      };
      // options.order = {name: "ASC", dob: "DESC"}
      if (options.order) {
        // => [["name", "ASC"], ["dob", "DESC"]]
        dbOptions.order = Object.entries(options.order);
      }
      if (options.limit) {
        dbOptions.limit = options.limit;
        dbOptions.offset = options.offset;
      }
      return User.findAll(dbOptions);
    },
    findOne: async function (filters) {
      return User.findOne({ where: filters });
    },
    create: async function (data) {
      try {
        return await User.create(data);
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    replace: async function (filters, newData) {
      try {
        const nbDeleted = await this.delete(filters);
        const user = await this.create(newData);
        return [[user, nbDeleted === 0]];
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    update: async (filters, newData) => {
      try {
        const [nbUpdated, users] = await User.update(newData, {
          where: filters,
          returning: true,
          individualHooks: true,
        });

        return users;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    delete: async (filters) => {
      return User.destroy({ where: filters });
    },
    login: async (email, password) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new ValidationError({
          email: "Invalid credentials",
        });
      }
      const isPasswordValid = await user.isPasswordValid(password);
      if (!isPasswordValid) {
        throw new ValidationError({
          email: "Invalid credentials",
        });
      }

      return user;
    },
    getLastGames: async (userId) => {
      try {
      const games = await Game.findAll({
        where: {
          [Sequelize.Op.or]: [
            { WhiteUserID: userId },
            { BlackUserID: userId },
          ],
          "GameStatus": "end",
        },
        order: [["updatedAt", "DESC"]],
        limit: 10,
      });

      return games;
      } catch (e) {
        throw new Error('Failed to retrieve the last 10 games for the user.');
        }
    },
    getNbGames: async (userId) => {
      try {
        const nbGames = await Game.count({
          where: {
            [Sequelize.Op.or]: [
              { WhiteUserID: userId },
              { BlackUserID: userId },
            ],
            "GameStatus": "end",
          },
        });
        return nbGames;
      } catch (e) {
        throw new Error('Failed to retrieve the number of games for the user.');
      }
    },
    getNbWins: async (userId) => {
      try {
        const nbWins = await Game.count({
          where: {
            [Sequelize.Op.or]: [
              { WhiteUserID: userId },
              { BlackUserID: userId },
            ],
            "GameStatus": "end",
            "Winner": userId,
          },
        });
        return nbWins;
      } catch (e) {
        throw new Error('Failed to retrieve the number of wins for the user.');
      }
    },
    getNbLosses: async (userId) => {
      try {
        const nbLosses = await Game.count({
          where: {
            [Sequelize.Op.or]: [
              { WhiteUserID: userId },
              { BlackUserID: userId },
            ],
            "GameStatus": "end",
            "Winner": {
              [Sequelize.Op.not]: userId,
            },
          },
        });
        return nbLosses;
      } catch (e) {
        throw new Error('Failed to retrieve the number of losses for the user.');
      }
    },
    getNbDraws: async (userId) => {
      try {
        const nbDraws = await Game.count({
          where: {
            [Sequelize.Op.or]: [
              { WhiteUserID: userId },
              { BlackUserID: userId },
            ],
            "GameStatus": "end",
            "Winner": null,
          },
        });
        return nbDraws;
      } catch (e) {
        throw new Error('Failed to retrieve the number of draws for the user.');
      }
    },
    getGameStats: async (userId) => {
      try {
        const nbGames = await UserService().getNbGames(userId);
        const nbWins = await UserService().getNbWins(userId);
        const nbLosses = await UserService().getNbLosses(userId);
        const nbDraws = await UserService().getNbDraws(userId);
        const lastGames = await UserService().getLastGames(userId);
        return {
          nbGames,
          nbWins,
          nbLosses,
          nbDraws,
          lastGames,
        };
      } catch (e) {
        throw new Error('Failed to retrieve the game stats for the user.');
      }
    },
    getFriends: async (userId) => {
      try {
        const user = await User.findOne({
          where: {
            id: userId,
          }
        });
        if (!user) {
          throw new Error('User not found.');
        }

        const friends = await Friend.findAll({
          where: {
            [Sequelize.Op.or]: [
              { id_user: userId },
              { id_user_receiver: userId },
            ],
            status: 'accepted',
          },
        });

        const friendsIds = await User.findAll({
          where: {
            [Sequelize.Op.not]: {
              id: userId,
            },
            [Sequelize.Op.or]: [
              { id: friends.map(friend => friend.id_user) },
              { id: friends.map(friend => friend.id_user_receiver) },
            ],
          },
        });

        return friendsIds;

      } catch (e) {
        throw new Error('Failed to retrieve the friends for the user.');
      }
    },
    getBuys: async (userId) => {
      try {
        const buys = await Buy.findAll({
          where: {
            id_user: userId,
          },
        });

        const buysIds = await Article.findAll({
          where: {
            id: buys.map(buy => buy.id_article),
          },
        });

        return buysIds;
      } catch (e) {
        throw new Error('Failed to retrieve the buys for the user.');
      }
    }
  };
};
