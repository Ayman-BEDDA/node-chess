const { Money } = require('../db');
const Sequelize = require('sequelize');
const ValidationError = require('../errors/ValidationError');

module.exports = function MoneyService() {
    return {
        async create(data) {
            try {
                return await Money.create(data);
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        async findAll(filters, options) {
            let dbOptions = {
                where: filters,
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
            return Money.findAll(dbOptions);
        },
        async findOne(filters) {
            return Money.findOne({ where: filters });
        },
        async replace(filters, newData) {
            try {
                const nbDeleted = await this.delete(filters);
                const money = await this.create(newData);
                return [[money, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        async update(filters, newData) {
            try {
                const [nbUpdated, moneys] = await Money.update(newData, {
                    where: filters,
                    returning: true,
                    individualHooks: true,
                });

                return moneys;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        async delete(filters) {
            return Money.destroy({ where: filters });
        }
    }
}