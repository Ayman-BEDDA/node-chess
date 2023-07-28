const faker = require('faker');
const sequelize = require('../db/db');
const UserModel = require('../db/models/User');
const GameModel = require('../db/models/Game');
const { v4: uuidv4 } = require('uuid');



const User = UserModel(sequelize);
const Game = GameModel(sequelize);

async function generateGameData() {
  const users = await User.findAll({}, {});
  const existingUserIds = users.map((user) => user.id);

  if(users.length < 2){
    console.log("Pas assez d'utilisateurs pour créer des parties d'échecs");
    return;
  }

  const statuses = ['playing', 'end'];

  for (let i = 0; i < 50; i++) {
    let whiteUserId, blackUserId;
    do {
      whiteUserId = existingUserIds[Math.floor(Math.random() * users.length)];
      blackUserId = existingUserIds[Math.floor(Math.random() * users.length)];
    } while (whiteUserId == blackUserId);

    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const winnerId = Math.random() > 0.5 ? whiteUserId : blackUserId;

    const game = {
      WhiteUserID: existingUserIds[Math.floor(Math.random() * users.length)],
      BlackUserID: existingUserIds[Math.floor(Math.random() * users.length)],
      GameStatus: status,
      Winner: status == 'end' ? existingUserIds[winnerId] : null, 
    };

    await Game.create(game);
  }
}

module.exports = generateGameData;
