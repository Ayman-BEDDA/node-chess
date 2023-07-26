const genericController = require("./generic");
const { v4: uuidv4 } = require('uuid');

module.exports = function GameController(Service, options = {}) {
  const GenericController = genericController(Service, options);

  return {
    ...GenericController,
    authorized: async (req, res) => {
      try {
        const { id } = req.params;
        const { user_id } = req.body;
    
        const game = await Service.findOne({ id: id });

        if (game) {
          if (game.WhiteUserID === user_id || game.BlackUserID === user_id && game.GameStatus === 'playing') {
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
    }
  };
};
