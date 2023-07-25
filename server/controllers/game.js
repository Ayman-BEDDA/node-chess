const genericController = require("./generic");
const { v4: uuidv4 } = require('uuid');

module.exports = function GameController(Service, options = {}) {
  const GenericController = genericController(Service, options);

  return {
    ...GenericController,
    new: async (req, res) => {
      try {
        const gameId = uuidv4();

        const game = await Service.create({
          game_id: gameId,
          WhiteUserID: req.body.whiteUserID,
          BlackUserID: req.body.blackUserID,
          GameStatus: 'InProgress',
        });

        res.json({ gameId });
      } catch (error) {
        res.status(500).json({ error: error.toString() });
      }
    }
  };
};
