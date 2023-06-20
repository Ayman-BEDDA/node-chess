const { Router } = require("express");

module.exports = function (Controller, options = {}) {
  const router = new Router();

  router.get("/", Controller.getAll);
  router.post("/", Controller.create);

  router.get("/:id", Controller.getOne);
  router.put("/:id", Controller.replace);
  router.patch("/:id", Controller.update);
  router.delete("/:id", Controller.delete);

  return router;
};
