const faker = require('faker');
const sequelize = require('../db/db');
const OwnModel = require('../db/models/Own');
const MoneyModel = require('../db/models/Money');
const UserModel = require('../db/models/User');
const Own = OwnModel(sequelize);
const Money = MoneyModel(sequelize);
const User = UserModel(sequelize);

async function generateOwnData() {
    const moneys = await Money.findAll({}, {});
    const users = await User.findAll({}, {});
    const existingMoneyIds = moneys.map((money) => money.id);
    const existingUserIds = users.map((user) => user.id);

    //fixture just for the admin
    await Own.create({
        amount: 0,
        id_money: existingMoneyIds[0],
        id_user: existingUserIds[2]
    });

    await Own.create({
        amount: 0,
        id_money: existingMoneyIds[1],
        id_user: existingUserIds[2]
    });

    //fixture just for the users
    await Own.create({
        amount: 0,
        id_money: existingMoneyIds[0],
        id_user: existingUserIds[12]
    });

    await Own.create({
        amount: 0,
        id_money: existingMoneyIds[1],
        id_user: existingUserIds[12]
    });
}

module.exports = generateOwnData;