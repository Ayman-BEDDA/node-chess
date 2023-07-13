const sequelize = require('../db/db');
const RoleModel = require('../db/models/Role');

const Role = RoleModel(sequelize);

async function generateRoleData() {
  const roles = ['admin', 'moderator', 'user'];

  for (let i = 0; i < roles.length; i++) {
    const role = {
      libelle: roles[i]
    };

    await Role.create(role);
  }
}

module.exports = generateRoleData;