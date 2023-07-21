const faker = require('faker');
const sequelize = require('../db/db');
const OwnModel = require('../db/models/Own');

const Own = OwnModel(sequelize);

async function generateOwnData() {

    //fixture just for the admin
    await Own.create({
        amount: 0,
        id_money: 1,
        id_user: 3
    });

    await Own.create({
        amount: 0,
        id_money: 2,
        id_user: 3
    });

    //fixture just for the users
    await Own.create({
        amount: 0,
        id_money: 1,
        id_user: 13
    });

    await Own.create({
        amount: 0,
        id_money: 2,
        id_user: 13
    });
}

module.exports = generateOwnData;