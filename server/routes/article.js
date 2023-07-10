const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const ArticleService = require("../services/article");
//module.exports = new genericRouter(new genericController(new ArticleService()));

const { Router } = require("express");
const ArticleController = require("../controllers/article");

const router = new Router();
const controller = new ArticleController(new ArticleService());

router.post("/:idArticle/buy", controller.buyArticle);
router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", controller.replace);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
