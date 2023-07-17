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

    //Les crédits premium qu'on peut avec de la vraie monnaie sont des articles avec id_money =3 et euros != null
    await Article.create({
        libelle: "Pack 5000 pièces",
        price: 5000,
        media: faker.image.imageUrl(),
        euros: 5,
        id_money: 3
    })
}

module.exports = generateArticleData;