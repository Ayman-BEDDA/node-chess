const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const GameService = require("../services/game");

module.exports = new genericRouter(new genericController(new GameService()));