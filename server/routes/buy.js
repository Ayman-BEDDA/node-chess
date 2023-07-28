const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const BuyService = require("../services/buy");

module.exports = new genericRouter(new genericController(new BuyService()));