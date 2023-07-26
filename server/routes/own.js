const OwnService = require("../services/own");
const { Router } = require("express");
const OwnController = require("../controllers/own");
const router = new Router();
const controller = new OwnController(new OwnService());

router.post("/", controller.dailyRewards);
router.post("/:idArticle/buy-money", controller.buyPremiumMoney); //buy premium money with €
router.get("/", controller.getOwns);

module.exports = router;