const { User, Game, Friend, Article, Buy, Own, Role} = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const MoneyService = require("./money");

module.exports = function UserService() {
  return {
    findAll: async function (filters, options) {
      let dbOptions = {
        where: filters,
        include: [
          { model: Role, as: 'role' },
        ],
      };
      options.order = {createdAt: "DESC"}
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
      return User.findOne({ 
        where: filters, 
        include: [
          { model: Role, as: 'role' },
        ], 
      });
    },
    create: async function (data) {
      const moneys = await MoneyService().findAll({}, {});
      const existingMoneyIds = moneys.map((money) => money.id);
      let createdUser;
      let createdOwns;

      try {
        // Créer l'utilisateur
        createdUser = await User.create(data);

        // Créer les enregistrements Own associés à l'utilisateur
        createdOwns = await Own.bulkCreate([
          { id_user: createdUser.id, id_money: existingMoneyIds[0], amount: 0 },
          { id_user: createdUser.id, id_money: existingMoneyIds[1], amount: 0 }
        ]);

        // Retourner l'utilisateur créé
        return createdUser;
      } catch (e) {
        // En cas d'erreur, supprimer l'utilisateur et les Owns associés
        if (createdUser) {
          await createdUser.destroy();
        }
        if (createdOwns) {
          await Own.destroy({ where: { id_user: createdUser.id } });
        }

        // Gérer les erreurs de validation
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }

        // Lancer l'erreur
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
      const user = await User.findOne({ where: { email }, include: [{ model: Role, as: 'role' },],  });
      if (!user) {
        throw new ValidationError({
          error: "Invalid credentials",
        });
      }
      const isPasswordValid = await user.isPasswordValid(password);
      if (!isPasswordValid) {
        throw new ValidationError({
          error: "Invalid credentials",
      });
      }

      if (user && !user.isValid) {
        throw new ValidationError({
          error: "Votre compte n'est pas encore activé. Veuillez vérifier votre boîte de réception pour activer votre compte.",
        });
      }
      user.lastLoginDate = new Date();
      await user.save();

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
            GameStatus: "end",
          },
          include: [
            {
              model: User,
              as: "whiteUser",
            },
            {
              model: User,
              as: "blackUser",
            },
            {
              model: User,
              as: "winnerUser",
            },
          ],
          order: [["updatedAt", "DESC"]],
        });
      
        return games;
      } catch (e) {
        throw new Error('Failed to retrieve the last 10 games for the user.');
      }
    },
    getGameStats: async (userId) => {
      try {
        const games = await Game.findAll({
          where: {
            [Sequelize.Op.or]: [
              { WhiteUserID: userId },
              { BlackUserID: userId },
            ],
            GameStatus: "end",
          },
          order: [["updatedAt", "DESC"]],
        });

        const nbGames = games.length;
        const nbWins = await Game.count({
          where: {
            [Sequelize.Op.or]: [
              { WhiteUserID: userId },
              { BlackUserID: userId },
            ],
            GameStatus: "end",
            Winner: userId,
          },
        });
        const nbLosses = await Game.count({
          where: {
            [Sequelize.Op.or]: [
              { WhiteUserID: userId },
              { BlackUserID: userId },
            ],
            GameStatus: "end",
            Winner: {
              [Sequelize.Op.not]: userId,
            },
          },
        });
        const nbDraws = await Game.count({
          where: {
            [Sequelize.Op.or]: [
              { WhiteUserID: userId },
              { BlackUserID: userId },
            ],
            GameStatus: "end",
            Winner: null,
          },
        });
        const winRate = nbGames === 0 ? 0 : Math.round((nbWins / nbGames) * 100);

        return {
          nbGames,
          nbWins,
          nbLosses,
          nbDraws,
          winRate,
        };
      }
      catch (e) {
        throw new Error('Failed to retrieve the stats for the user.');
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
          include: [
            {
              model: Article,
              as: 'article',
            },
          ],
        }); 

        return buys;
      } catch (e) {
        throw new Error('Failed to retrieve the buys for the user.');
      }
    },
    getAvatar: async (userId) => {
      try {
        const user = await User.findOne({
          where: {
            id: userId,
          },
        });

        return user.media;
      } catch (e) {
        throw new Error('Failed to retrieve the avatar for the user.');
      }
    }
  };
};
