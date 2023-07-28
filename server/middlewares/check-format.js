module.exports = (req, res, next) => {
  if (
    ["POST", "PATCH", "PUT"].includes(req.method) &&
    !req.is("application/json") &&
    !req.is("multipart/form-data")
  ) {
    res.sendStatus(400);
  } else {
    next();
  }
};
