module.exports = function UserController(UserService) {
    return {
        getLastGames: async (req, res) => {
          const userId = req.params.id_user;
          try {
            const games = await UserService.getLastGames(userId);
            res.status(200).json(games);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve the last 10 games for the user.' });
          }
        },
        getNbGames: async (req, res) => {
          const userId = req.params.id_user;
          try {
            const nbGames = await UserService.getNbGames(userId);
            res.status(200).json(nbGames);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve the number of games for the user.' });
          }
        },
        getNbWins: async (req, res) => {
          const userId = req.params.id_user;
          try {
            const nbWins = await UserService.getNbWins(userId);
            res.status(200).json(nbWins);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve the number of wins for the user.' });
          }
        },
        getNbLosses: async (req, res) => {
          const userId = req.params.id_user;
          try {
            const nbLosses = await UserService.getNbLosses(userId);
            res.status(200).json(nbLosses);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve the number of losses for the user.' });
          }
        },
        getNbDraws: async (req, res) => {
          const userId = req.params.id_user;
          try {
            const nbDraws = await UserService.getNbDraws(userId);
            res.status(200).json(nbDraws);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve the number of draws for the user.' });
          }
        },
        getGameStats: async (req, res) => {
          const userId = req.params.id_user;
          try {
            const nbGames = await UserService.getNbGames(userId);
            const nbWins = await UserService.getNbWins(userId);
            const nbLosses = await UserService.getNbLosses(userId);
            const nbDraws = await UserService.getNbDraws(userId);
            res.status(200).json({
              nbGames,
              nbWins,
              nbLosses,
              nbDraws,
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve the game statistics for the user.' });
          }
        },
        getFriends: async (req, res) => {
          const userId = req.params.id_user;
          try {
            const friends = await UserService.getFriends(userId);
            res.status(200).json(friends);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve the friends for the user.' });
          }
        }
    };
};