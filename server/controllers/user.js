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
        getGameStats: async (req, res) => {
          const userId = req.params.id_user;
          try {
            const gameStats = await UserService.getGameStats(userId);
            res.status(200).json(gameStats);
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
        },
        getBuys: async (req, res) => {
          const userId = req.params.id_user;
          try {
            const buys = await UserService.getBuys(userId);
            res.status(200).json(buys);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve the buys for the user.' });
          }
        },
        getAvatar: async (req, res) => {
          const userId = req.params.id_user;
          try {
            const avatar = await UserService.getAvatar(userId);
            res.status(200).json(avatar);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve the avatar for the user.' });
          }
        },
        getUsersFromMongo: async (req, res, next) => {
            try {
                const users = await UserService.getUsersFromMongo();
                res.status(200).json(users);
            } catch (error) {
                next(error);
            }
        },
        postUserToMongo: async (req, res, next) => {
            const { body } = req;
            try {
                const result = await UserService.postUserToMongo(body);
                res.status(201).json(result);
            } catch (error) {
                next(error);
            }
        },
        matchmaking: async (req, res, next) => {
            const { body } = req;
            try {
                const users = await UserService.matchmaking(body);
                res.status(201).json(users);
            } catch (error) {
                next(error);
            }
        },
        deleteUser: async (req, res, next) => {
            const userId = req.params.id
            try {
                const result = await UserService.deleteUser(userId);
                res.status(204)
            } catch (error) {
                next(error);
            }
        }
    };
};