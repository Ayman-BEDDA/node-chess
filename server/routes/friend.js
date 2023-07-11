const { Router } = require("express");
const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const FriendService = require("../services/friend");

const router = new Router();

router.use("/", new genericRouter(new genericController(new FriendService())));

module.exports = router;