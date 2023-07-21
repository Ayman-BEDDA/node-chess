const OwnService = require("../services/own");
const { Router } = require("express");
const OwnController = require("../controllers/own");
const router = new Router();
const controller = new OwnController(new OwnService());

router.post("/", controller.dailyRewards);
router.patch("/:idArticle/buy-money", controller.buyPremiumMoney);
router.get("/", controller.getOwns);

module.exports = router;