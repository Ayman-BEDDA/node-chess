const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const MoneyService = require("../services/money");

module.exports = new genericRouter(new genericController(new MoneyService()));