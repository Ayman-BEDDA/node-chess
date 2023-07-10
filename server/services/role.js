const { Role } = require('../db');
const Sequelize = require('sequelize');
const ValidationError = require('../errors/ValidationError');

module.exports = function RoleService() {
    return {
        create: async function (data) {
            try {
                return await Role.create(data);
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
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
            return Role.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Role.findOne({ where: filters });
        },
        replace: async function (filters, newData) {
            try {
                const nbDeleted = await this.delete(filters);
                const role = await this.create(newData);
                return [[role, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, roles] = await Role.update(newData, {
                    where: filters,
                    returning: true,
                    individualHooks: true,
                });

                return roles;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async (filters) => {
            return Role.destroy({ where: filters });
        }
    }
}