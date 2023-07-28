module.exports = (req, res, next) => {
    if (req.user.role_libelle !== "admin") {
        res.sendStatus(403);
    } else {
        next();
    }
}