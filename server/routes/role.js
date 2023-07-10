const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const RoleService = require("../services/role");

module.exports = new genericRouter(new genericController(new RoleService()));