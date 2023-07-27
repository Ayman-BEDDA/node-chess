const { Game } = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const { v4: uuidv4 } = require("uuid");
const { isUUID } = require("validator");

module.exports = function GameService() {
  return {
    findAll: async function (filters, options) {
      let dbOptions = {
        where: filters,
      };
      if (options.order) {
        dbOptions.order = Object.entries(options.order);
      }
      if (options.limit) {
        dbOptions.limit = options.limit;
        dbOptions.offset = options.offset;
      }
      return Game.findAll(dbOptions);
    },
    findOne: async function (filters) {
      return Game.findOne({ where: filters });
    },
    create: async function (data) {
      try {
        return await Game.create(data);
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
        const game = await this.create(newData);
        return [[game, nbDeleted === 0]];
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    update: async (filters, newData) => {
      try {
        const [nbUpdated, games] = await Game.update(newData, {
          where: filters,
          returning: true,
          individualHooks: true,
        });

        return games;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    delete: async (filters) => {
      return Game.destroy({ where: filters });
    },
    calculateElo: (white, black, winner) => {
      const whiteExpectation = 1 / (1 + Math.pow(10, ((black - white) / 400)));
      const blackExpectation = 1 / (1 + Math.pow(10, ((white - black) / 400)));
    
      let whiteScore, blackScore;
    
      const K = 32;
    
      if (winner === 'white') {
        whiteScore = 1;
        blackScore = 0;
      } else if (winner === 'black') {
        whiteScore = 0;
        blackScore = 1;
      } else {
        whiteScore = 0.5;
        blackScore = 0.5;
      }
    
      const whiteNewElo = Math.floor(white + K * (whiteScore - whiteExpectation));
      const blackNewElo = Math.floor(black + K * (blackScore - blackExpectation));
    
      return { whiteNewElo, blackNewElo };
    }
  };
};
