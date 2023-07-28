const faker = require('faker');
const sequelize = require('../db/db');
const ArticleModel = require('../db/models/Article');
const MoneyService = require("../services/money");

const Article = ArticleModel(sequelize);

async function generateArticleData() {
    const moneys = await MoneyService().findAll({}, {});
    const existingMoneyIds = moneys.map((money) => money.id);

    const articles = [];

    for (let i = 0; i < 10; i++) {
        const article = {
            libelle: faker.commerce.productName(),
            price: faker.commerce.price(),
            media: "./assets/echiquier-bois.jpg",
            id_money: existingMoneyIds[Math.floor(Math.random() * 2)],
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
        id_money: existingMoneyIds[2],
    })
}

module.exports = generateArticleData;