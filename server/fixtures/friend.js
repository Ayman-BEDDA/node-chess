const faker = require('faker');
const sequelize = require('../db/db');
const UserModel = require('../db/models/User');
const FriendModel = require('../db/models/Friend');

const User = UserModel(sequelize);
const Friend = FriendModel(sequelize);

async function generateFriendData() {
  // Obtenir tous les utilisateurs
  const users = await User.findAll({}, {});
  const existingUserIds = users.map((user) => user.id);

  if(users.length < 2){
    console.log("Pas assez d'utilisateurs pour créer des relations d'amitié");
    return;
  }

  // Liste des statuts possibles
  const statuses = ['waiting', 'denied', 'accepted'];

  for (let i = 0; i < users.length; i++) {
    let userId = null;
    let friendId = null;
    do {
      userId = existingUserIds[Math.floor(Math.random() * users.length)];
      friendId = existingUserIds[Math.floor(Math.random() * users.length)];
    } while (friendId == userId);

    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const friend = {
      status: status,
      id_user: existingUserIds[Math.floor(Math.random() * users.length)],
      id_user_receiver: existingUserIds[Math.floor(Math.random() * users.length)],
    };

    await Friend.create(friend);
  }
}

module.exports = generateFriendData;