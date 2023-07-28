const { Router } = require("express");
const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const FriendController = require("../controllers/friend");
const FriendService = require("../services/friend");

const router = new Router();
const Controller = new FriendController(new FriendService());

router.use("/", new genericRouter(new genericController(new FriendService())));
router.get("/:id/friends_list", Controller.friends_list);
router.get("/:id/pending", Controller.pending);
router.post("/:id/send/:id_receiver", Controller.send);
router.patch("/:id/deny/:id_receiver", Controller.deny);
router.patch("/:id/accept/:id_receiver", Controller.accept);
router.delete("/:id/delete/:id_receiver", Controller.delete);

module.exports = router;