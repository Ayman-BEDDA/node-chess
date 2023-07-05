const faker = require('faker');
const sequelize = require('../db/db');
const UserModel = require('../db/models/User');

const User = UserModel(sequelize);

async function generateTestData() {

  await User.create({
    login: 'admin',
    email: 'admin@domain.com',
    password: 'password',
    elo: 1500,
    media: "default.png",
    isBanned: false,
    isValid: true,
    id_role: 3,
  });

  for (let i = 0; i < 10; i++) {
    await User.create({
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      elo: Math.floor(Math.random() * 1000) + 500,
      media: "default.png",
      isBanned: false,
      isValid: false,
      id_role: 2,
    });
  }

  for (let i = 0; i < 50; i++) {
    await User.create({
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      elo: Math.floor(Math.random() * 1000) + 500,
      media: "default.png",
      isBanned: false,
      isValid: false,
      id_role: 1,
    });
  }
}

module.exports = generateTestData;
