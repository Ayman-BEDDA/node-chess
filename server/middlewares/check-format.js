module.exports = (req, res, next) => {
  if (
    ["POST", "PATCH", "PUT"].includes(req.method) &&
    !req.is("application/json")
  ) {
    res.sendStatus(400);
  } else {
    next();
  }
};
