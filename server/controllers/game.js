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
          WhiteUserID: req.body.whiteUserID,
          BlackUserID: req.body.blackUserID,
          GameStatus: 'InProgress',
        });

        res.json({ game });
      } catch (error) {
        res.status(500).json({ error: error.toString() });
      }
    },
    exist: async (req, res) => {
    try {
        const session = req.body.session;
    
        // Recherchez le jeu avec l'ID spécifié
        const game = await Service.findOne({ session: session });
    
        if (!game) {
        // Si le jeu n'est pas trouvé, renvoyez une réponse indiquant que le jeu n'existe pas
        return res.status(404).json({ error: 'Game not found' });
        }
    
        // Si le jeu est trouvé, renvoyez une réponse indiquant que le jeu existe
        return res.status(200).json({ message: 'Game exists' });
    } catch (error) {
        // Si une erreur se produit, renvoyez une réponse avec le message d'erreur
        return res.status(500).json({ error: error.toString() });
    }
    }
      
  };
};
