const faker = require('faker');
const sequelize = require('../db/db');
const UserModel = require('../db/models/User');
const RoleService = require("../services/role");

const User = UserModel(sequelize);

async function generateTestData() {
  const adminRole = await RoleService().findOne({ libelle: 'admin' });
  const userRole = await RoleService().findOne({ libelle: 'user' });

  await User.create({
    login: 'admin',
    email: 'admin@domain.com',
    password: 'password',
    elo: 1500,
    media: "default.png",
    isBanned: false,
    isValid: true,
    id_role: adminRole.id,
  });

  for (let i = 0; i < 50; i++) {
    await User.create({
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: 'password123',
      elo: Math.floor(Math.random() * 1000) + 500,
      media: "default.png",
      isBanned: false,
      isValid: false,
      id_role: userRole.id,
    });
  }
}

module.exports = generateTestData;