const { Game } = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function GameService() {
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
  };
};
