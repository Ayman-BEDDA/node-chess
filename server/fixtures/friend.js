const faker = require('faker');
const sequelize = require('../db/db');
const UserModel = require('../db/models/User');
const FriendModel = require('../db/models/Friend');

const User = UserModel(sequelize);
const Friend = FriendModel(sequelize);

async function generateFriendData() {
  // Obtenir tous les utilisateurs
  const users = await User.findAll();

  if(users.length < 2){
    console.log("Pas assez d'utilisateurs pour créer des relations d'amitié");
    return;
  }

  // Liste des statuts possibles
  const statuses = ['waiting', 'denied', 'accepted'];

  for (let i = 0; i < users.length; i++) {
    let friendId = null;
    do {
      friendId = Math.floor(Math.random() * users.length);
    } while (friendId == i);

    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const friend = {
      status: status,
      id_user: users[i].id,
      id_user_receiver: users[friendId].id,
    };

    await Friend.create(friend);
  }
}

module.exports = generateFriendData;