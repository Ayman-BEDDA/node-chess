const { v4: uuidv4 } = require("uuid");
const { isUUID } = require("validator");

module.exports = function Controller(Service, options = {}) {
  return {
    getAll: async (req, res, next) => {
      const { page, itemsPerPage, order, ...filters } = req.query;
      try {
        const results = await Service.findAll(filters, {
          order,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        });

        res.json(results);
      } catch (err) {
        next(err);
      }
    },
    getOne: async (req, res, next) => {
      const { id } = req.params;
      try {
        if (!isUUID(id)) {
          res.sendStatus(404);
        }
        const result = await Service.findOne({ id: id });
        if (result) res.json(result);
        else res.sendStatus(404);
      } catch (err) {
        next(err);
      }
    },
    create: async (req, res, next) => {
      const { body } = req;
      try {
        const result = await Service.create(body);
        res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    },
    replace: async (req, res, next) => {
      const { id } = req.params;
      const { body } = req;
      try {
        if (!isUUID(id)) {
          res.sendStatus(404);
        }
        const [[result, created]] = await Service.replace(
          { id: parseInt(id, 10) },
          { id: parseInt(id, 10), ...body }
        );
        if (created) res.status(201).json(result);
        else res.json(result);
      } catch (err) {
        next(err);
      }
    },
    update: async (req, res, next) => {
      const { id } = req.params;
      const { body } = req;
      try {
        if (!isUUID(id)) {
          res.sendStatus(404);
        }
        const [result] = await Service.update({ id: id }, body);
        if (result) res.json(result);
        else res.sendStatus(404);
      } catch (err) {
        next(err);
      }
    },
    delete: async (req, res, next) => {
      const { id } = req.params;
      try {
        if (!isUUID(id)) {
          res.sendStatus(404);
        }
        const nbDeleted = await Service.delete({ id: id });
        if (nbDeleted) res.sendStatus(204);
        else res.sendStatus(404);
      } catch (err) {
        next(err);
      }
    },
  };
};
