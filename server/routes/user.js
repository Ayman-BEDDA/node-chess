const { Router } = require("express");
const UserController = require("../controllers/user");
const UserService = require("../services/user");

const genericRouter = require("./generic");
const genericController = require("../controllers/generic");

const router = new Router();
const Controller = new UserController(new UserService());

//route générique
router.use("/", new genericRouter(new genericController(new UserService())));

//route spécifique
router.get("/:id_user/lastgames", Controller.getLastGames);
router.get("/:id_user/gamestats", Controller.getGameStats);
router.get("/:id_user/friends", Controller.getFriends);
router.get("/:id_user/buys", Controller.getBuys);
router.get("/:id_user/avatar", Controller.getAvatar);
router.post("/mongo", Controller.postUserToMongo);
router.post("/matchmaking", Controller.matchmaking);
router.delete('/:id/delete', Controller.deleteUser);

module.exports = router; //export du genericRouter + route lastgame