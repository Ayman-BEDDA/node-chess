const faker = require('faker');
const sequelize = require('../db/db');
const ArticleModel = require('../db/models/Article');

const Article = ArticleModel(sequelize);

async function generateArticleData() {

    const articles = [];

    for (let i = 0; i < 10; i++) {
        const article = {
            libelle: faker.commerce.productName(),
            price: faker.commerce.price(),
            media: faker.image.imageUrl(),
            id_money: faker.datatype.number({ min: 1, max: 2 })
        };
        articles.push(article);
    }
    await Article.bulkCreate(articles);
}

module.exports = generateArticleData;