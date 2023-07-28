const { Router } = require("express");
const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const GameController = require("../controllers/game");
const GameService = require("../services/game");

const router = new Router();
const Controller = new GameController(new GameService());

router.use("/", new genericRouter(new genericController(new GameService())));
router.post("/:id/authorized", Controller.authorized);
router.patch("/:id/elo", Controller.elo);


module.exports = router;