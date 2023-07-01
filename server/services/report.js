const {Report} = require('../db/models/Report');

module.exports = function ReportService() {
    return {
        findAll: async function (filters, options) {
            let filteredReports = reports.filter((report) =>
            Object.entries(filters).every(([key, value]) => report[key] === value)
            );
            // options.order = {name: "ASC", dob: "DESC"}
            if (options.order) {
            filteredReports = filteredReports.sort((a, b) =>
                compare(a, b, options.order)
            );
            }
            if (options.limit) {
            filteredReports = filteredReports.slice(
                options.offset,
                options.offset + options.limit
            );
            }
            return filteredReports;
        },
        findOne: async function (filters) {
            return reports.find((report) =>
            Object.entries(filters).every(([key, value]) => report[key] === value)
            );
        },
        create: async function (data) {
            const report = { id: Date.now(), ...data };
            reports.push(report);
            return report;
        },
        replace: async (filters, newData) => {
            const reportIndex = reports.findIndex((report) =>
            Object.entries(filters).every(([key, value]) => report[key] === value)
            );
            if (reportIndex === -1) {
            reports.push(newData);
            return [[newData, true]];
            } else {
            reports.splice(reportIndex, 1, newData);
            return [[newData, false]];
            }
        },
        update: async (filters, newData) => {
            const report = reports.find((report) =>
            Object.entries(filters).every(([key, value]) => report[key] === value)
            );
            if (!report) return [];
            Object.assign(report, newData);
            return [report];
        },
        delete: (filters) => {
            let nbDeleted = 0;
            reports = reports.filter((report) => {
            if (
                Object.entries(filters).every(([key, value]) => report[key] === value)
            ) {
                nbDeleted++;
                return false;
            } else {
                return true;
            }
            });
            return nbDeleted;
        },
        
    };
};