const { Friend } = require("../db/models/Friend");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function FriendService() {
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
        console.log(Friend);
        //return Friend.findAll(dbOptions);
    },
    findOne: async function (filters) {
        return User.findOne({ where: filters });
    },
    create: async function (data) {
        try {
          return await Friend.create(data);
        } catch (e) {
          if (e instanceof Sequelize.ValidationError) {
            throw ValidationError.fromSequelizeValidationError(e);
          }
          throw e;
        }
    },
    replace: async (filters, newData) => {
        try {
          const nbDeleted = await this.delete(filters);
          const friend = await this.create(newData);
          return [[friend, nbDeleted === 0]];
        } catch (e) {
          if (e instanceof Sequelize.ValidationError) {
            throw ValidationError.fromSequelizeValidationError(e);
          }
          throw e;
        }
    },
    update: async (filters, newData) => {
        try {
            const [nbUpdated, friends] = await Friend.update(newData, {
              where: filters,
              returning: true,
              individualHooks: true,
            });
    
            return friends;
          } catch (e) {
            if (e instanceof Sequelize.ValidationError) {
              throw ValidationError.fromSequelizeValidationError(e);
            }
            throw e;
          }
    },
    delete: async (filters) => {
        return Friend.destroy({ where: filters });
    },
  };
};
