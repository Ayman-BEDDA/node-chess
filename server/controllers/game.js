const genericController = require("./generic");
const UserService = require("../services/user")();
const { v4: uuidv4 } = require('uuid');
const {isUUID} = require("validator");

module.exports = function GameController(Service, options = {}) {
  const GenericController = genericController(Service, options);

  return {
    ...GenericController,
    authorized: async (req, res) => {
      try {
        const { id } = req.params;
        const { user_id } = req.body;

        if (!isUUID(id)) {
          res.sendStatus(404);
        }
        
        const game = await Service.findOne({ id: id });

        if (game) {
          if(game.GameStatus != 'playing'){
            res.json({ "authorized": false });
          }
          if (game.WhiteUserID === user_id || game.BlackUserID === user_id) {
            res.json({ "authorized": true });
          } else {
            res.json({ "authorized": false });
          }
        } else {
          res.json({ "error": "Game not found" });
        }
      } catch (error) {
        res.status(500).json({ "error": error.toString() });
      }
    },
    elo: async (req, res) => {
      try {
        const { id } = req.params;
        const game = await Service.findOne({ id: id });

        if(game.GameStatus == "eloGiven"){
          return res.status(400).json({"status" : "Elo already given"});
        }

        if(game.GameStatus == "playing"){
          return res.status(400).json({"status" : "game in progress"});
        }

        const whiteUser = await UserService.findOne({id: game.WhiteUserID});
        const blackUser = await UserService.findOne({id: game.BlackUserID});

        let winner = "white";

        if(game.Winner == blackUser.id){
          winner = "black";
        } else if(game.Winner == null){
          winner = null;
        }

        const elos = await Service.calculateElo(whiteUser.elo, blackUser.elo, winner);

        whiteUser.elo = elos.whiteNewElo;
        whiteUser.save();

        blackUser.elo = elos.blackNewElo;
        blackUser.save();

        game.GameStatus = "eloGiven";
        game.save();

        res.status(200).json({"whiteUser" : whiteUser, "blackUser" :  blackUser, "game" : game});
      } catch (error) {
        res.status(500).json({ "error": error.toString() });
      }
    }
  };
};
