const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const OwnService = require("../services/own");

module.exports = new genericRouter(new genericController(new OwnService()));