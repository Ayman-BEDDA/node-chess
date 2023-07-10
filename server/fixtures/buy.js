const faker = require('faker');
const sequelize = require('../db/db');
const UserModel = require('../db/models/User');
const ArticleModel = require('../db/models/Article');
const BuyModel = require('../db/models/Buy');

const User = UserModel(sequelize);
const Article = ArticleModel(sequelize);
const Buy = BuyModel(sequelize);

async function generateBuyData() {
    const users = await User.findAll();
    const articles = await Article.findAll();
    
    const buys = [];
    
    for (let i = 0; i < users.length; i++) {
        const buy = {
        date: faker.date.past(),
        id_article: articles[Math.floor(Math.random() * articles.length)].id,
        id_user: users[Math.floor(Math.random() * users.length)].id,
        };
        buys.push(buy);
    }
    await Buy.bulkCreate(buys);

}

module.exports = generateBuyData;
