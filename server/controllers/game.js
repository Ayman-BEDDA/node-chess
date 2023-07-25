const genericController = require("./generic");
const { v4: uuidv4 } = require('uuid');

module.exports = function GameController(Service, options = {}) {
  const GenericController = genericController(Service, options);

  return {
    ...GenericController,
    new: async (req, res) => {
      try {
        const session = uuidv4();

        const game = await Service.create({
          session: session,
          WhiteUserID: 1,
          BlackUserID: 2,
          GameStatus: 'InProgress',
        });

        res.json({ game });
      } catch (error) {
        res.status(500).json({ error: error.toString() });
      }
    },
    exist: async (req, res) => {
      try {
        const { session } = req.params;
    
        const game = await Service.findOne({ session: session });
    
        if (game) {
          res.json({ game });
        } else {
          res.json({ "error": "Game not found" });
        }
      } catch (error) {
        res.status(500).json({ "error": error.toString() });
      }
    },

  };
};
