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
router.get("/:id_user/nbgames", Controller.getNbGames);
router.get("/:id_user/wins", Controller.getNbWins);
router.get("/:id_user/losses", Controller.getNbLosses);
router.get("/:id_user/draws", Controller.getNbDraws);
router.get("/:id_user/gamestats", Controller.getGameStats);
router.get("/:id_user/friends", Controller.getFriends);
router.get("/:id_user/buys", Controller.getBuys);

module.exports = router; //export du genericRouter + route lastgame