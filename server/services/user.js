const { User } = require("../db");
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
  };
};
