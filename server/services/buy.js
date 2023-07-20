const { Buy, User, Article } = require("../db");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");

module.exports = function BuyService() {
    return {
        findAll: async function (filters, options) {
            let dbOptions = {
                where: filters,
                include: [
                { model: Article, as: 'article', attributes: ['libelle'] },
                { model: User, as: 'user', attributes: ['login'] },
                ],
            };
            options.order = {date: "ASC"}
            if (options.order) {
                // => [["name", "ASC"], ["dob", "DESC"]]
                dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
                dbOptions.limit = options.limit;
                dbOptions.offset = options.offset;
            }
            return Buy.findAll(dbOptions);
        },
    };
};
