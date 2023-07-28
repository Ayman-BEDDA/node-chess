const { Report, User } = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function ReportService() {
  return {
    findAll: async function (filters, options) {
      let dbOptions = {
        where: filters,
        include: [
          { model: User, as: 'user' },
          { model: User, as: 'user_reported' },
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
      return Report.findAll(dbOptions);
    },
    findOne: async function (filters) {
      return Report.findOne({ where: filters });
    },
    create: async function (data) {
      try {
        return await Report.create(data);
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
        const report = await this.create(newData);
        return [[report, nbDeleted === 0]];
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    update: async (filters, newData) => {
      try {
        const [nbUpdated, reports] = await Report.update(newData, {
          where: filters,
          returning: true,
          individualHooks: true,
        });

        return reports;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          throw ValidationError.fromSequelizeValidationError(e);
        }
        throw e;
      }
    },
    delete: async (filters) => {
      return Report.destroy({ where: filters });
    },
  };
};
