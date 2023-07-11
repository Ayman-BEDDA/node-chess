const { Friend } = require("../db/models/Friend");

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
        return Friend.findAll(dbOptions);
    },
    findOne: async function (filters) {
      // Use the Sequelize findOne method
      return Friend.findOne({ where: filters });
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
      // Use the Sequelize update method for replace
      const result = await Friend.update(newData, { where: filters });
      return result ? Friend.findOne({ where: filters }) : null;
    },
    update: async (filters, newData) => {
      // Use the Sequelize update method for update
      await Friend.update(newData, { where: filters });
      return Friend.findOne({ where: filters });
    },
    delete: async (filters) => {
      // Use the Sequelize destroy method
      return Friend.destroy({ where: filters });
    },
  };
};
