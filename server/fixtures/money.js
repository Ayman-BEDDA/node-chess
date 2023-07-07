const sequelize = require('../db/db');
const MoneyModel = require('../db/models/Money');

const Money = MoneyModel(sequelize);

async function generateMoneyData() {
  const moneys = ['free', 'premium']

  for (let i = 0; i < moneys.length; i++) {
    const money = {
      type: moneys[i]
    };

    await Money.create(money);
  }
}

module.exports = generateMoneyData;