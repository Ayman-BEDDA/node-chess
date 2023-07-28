const faker = require('faker');
const sequelize = require('../db/db');
const UserModel = require('../db/models/User');
const ArticleModel = require('../db/models/Article');
const BuyModel = require('../db/models/Buy');

const User = UserModel(sequelize);
const Article = ArticleModel(sequelize);
const Buy = BuyModel(sequelize);

async function generateBuyData() {
    const users = await User.findAll({}, {});
    const articles = await Article.findAll({}, {});
    const existingUserIds = users.map((user) => user.id);
    const existingArticleIds = articles.map((article) => article.id);

    const buys = [];
    
    for (let i = 0; i < users.length; i++) {
        const buy = {
            date: faker.date.past(),
            id_article: existingArticleIds[Math.floor(Math.random() * articles.length)],
            id_user: existingUserIds[Math.floor(Math.random() * users.length)],
        };
        buys.push(buy);
    }
    await Buy.bulkCreate(buys);

}

module.exports = generateBuyData;
