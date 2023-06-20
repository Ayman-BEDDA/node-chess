module.exports = function Controller(Service, options = {}) {
  return {
    getAll: async (req, res) => {
      const { page, itemsPerPage, order, ...filters } = req.query;
      try {
        const results = await Service.findAll(filters, {
          order,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        });

        res.json(results);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    getOne: async (req, res) => {
      const { id } = req.params;
      try {
        const result = await Service.findOne({ id: parseInt(id, 10) });
        if (result) res.json(result);
        else res.sendStatus(404);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    create: async (req, res) => {
      const { body } = req;
      try {
        const result = await Service.create(body);
        res.status(201).json(result);
      } catch (err) {
        if (err.name === "ValidationError") {
          res.status(422).json(err.errors);
        } else {
          res.status(500).json(err);
        }
      }
    },
    replace: async (req, res) => {
      const { id } = req.params;
      const { body } = req;
      try {
        const [[result, created]] = await Service.replace(
          { id: parseInt(id, 10) },
          { id: parseInt(id, 10), ...body }
        );
        if (created) res.status(201).json(result);
        else res.json(result);
      } catch (err) {
        if (err.name === "ValidationError") {
          res.status(422).json(err.errors);
        } else {
          res.status(500).json(err);
        }
      }
    },
    update: async (req, res) => {
      const { id } = req.params;
      const { body } = req;
      try {
        const [result] = await Service.update({ id: parseInt(id, 10) }, body);
        if (result) res.json(result);
        else res.sendStatus(404);
      } catch (err) {
        if (err.name === "ValidationError") {
          res.status(422).json(err.errors);
        } else {
          res.status(500).json(err);
        }
      }
    },
    delete: async (req, res) => {
      const { id } = req.params;
      try {
        const nbDeleted = await Service.delete({ id: parseInt(id, 10) });
        if (nbDeleted) res.sendStatus(204);
        else res.sendStatus(404);
      } catch (err) {
        res.status(500).json(err);
      }
    },
  };
};
