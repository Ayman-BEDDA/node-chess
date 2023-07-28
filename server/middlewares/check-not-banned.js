module.exports = (req, res, next) => {
    if (req.user.isBanned === true) {
        res.sendStatus(403);
    } else {
        next();
    }
}