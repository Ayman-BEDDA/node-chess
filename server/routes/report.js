const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const ReportService = require("../services/report");

module.exports = new genericRouter(new genericController(new ReportService()));