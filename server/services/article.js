const { Article, User, Own, Buy, Money } = require('../db');
const Sequelize = require('sequelize');
const ValidationError = require('../errors/ValidationError');

module.exports = function ArticleService() {
    return {
        create: async function (data) {
            try {
                return await Article.create(data);
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
                include: [
                    { model: Money, as: 'money', attributes: ['type'] }
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
            return Article.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Article.findOne({ where: filters });
        },
        replace: async function (filters, newData) {
            try {
                const nbDeleted = await this.delete(filters);
                const article = await this.create(newData);
                return [[article, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, articles] = await Article.update(newData, {
                    where: filters,
                    returning: true,
                    individualHooks: true,
                });

                return articles;
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async function (filters) {
            return Article.destroy({ where: filters });
        },
        buyArticle: async function (articleId, userId) {
            try {
                // Vérifier si l'article existe
                const article = await Article.findOne({ where: { id: articleId } });
                if (!article) {
                    throw new ValidationError({ article: 'Article not found' });
                }

                // Vérifier si l'utilisateur existe
                const user = await User.findByPk(userId);
                if (!user) {
                    throw new ValidationError({ user: 'User not found' });
                }

                // Vérifier si l'utilisateur a suffisamment de crédits pour acheter l'article
                const money = await Own.findOne({ where: { id_user: userId, id_money: article.id_money } });
                if (!money || money.amount < article.price) {
                    throw new ValidationError({ money: 'Insufficient credits' });
                }

                try {
                    const checkBuy = await Buy.findOne({ where: { id_article: articleId, id_user: userId } });
                    if (!checkBuy) {
                        money.amount = money.amount - article.price;
                        await money.save();
                        return await Buy.create({
                            date: new Date(),
                            id_article: articleId,
                            id_user: userId,
                        });
                    } else {
                        throw new ValidationError({ buy: 'Article already bought' });
                    }

                } catch (e) {
                    if (e instanceof Sequelize.ValidationError) {
                        throw ValidationError.fromSequelizeValidationError(e);
                    }
                    throw e;
                }

            } catch (error) {
                throw error;
            }
        },
        getArticlesMoney: async function(id_money) {
            try {
                return await Article.findAll({where: {id_money: id_money, euros: { [Sequelize.Op.ne]: null }}})
            } catch (error) {
                throw error;
            }
        }
    }
}