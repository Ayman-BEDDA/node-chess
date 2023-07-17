module.exports = (req, res, next) => {
    if (req.user.isValid === false) {
        console.log(req.user)
        res.sendStatus(403);
    } else {
        next();
    }
}