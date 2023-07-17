const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const ArticleService = require("../services/article");
//module.exports = new genericRouter(new genericController(new ArticleService()));

const { Router } = require("express");
const ArticleController = require("../controllers/article");

const router = new Router();
const controller = new ArticleController(new ArticleService());
const checkAdmin = require("../middlewares/check-role");

router.post("/:idArticle/buy", controller.buyArticle);
router.post("/", checkAdmin,controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", checkAdmin, controller.replace);
router.patch("/:id", checkAdmin, controller.update);
router.delete("/:id", checkAdmin, controller.delete);
//router.get("/money-premium", controller.getArticlesMoney);

module.exports = router;
