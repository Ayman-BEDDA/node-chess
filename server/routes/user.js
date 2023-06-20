const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const UserService = require("../services/user");

module.exports = new genericRouter(new genericController(new UserService()));
