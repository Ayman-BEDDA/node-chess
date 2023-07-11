const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const FriendService = require("../services/friend");

module.exports = new genericRouter(new genericController(new FriendService()));