const HttpError = require("../errors/HttpError");
const ValidationError = require("../errors/ValidationError");

module.exports = (err, req, res, next) => {
  console.error(err);
  if (err instanceof ValidationError) {
    res.status(422).json(err.errors);
  } else if (err instanceof HttpError) {
    res.sendStatus(err.statusCode);
  } else {
    res.sendStatus(500);
  }
};
