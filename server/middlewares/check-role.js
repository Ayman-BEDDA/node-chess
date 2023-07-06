module.exports = (req, res, next) => {
    if (req.user.id_role !== 1) {
        console.log(req.user)
        res.sendStatus(403);
    } else {
        next();
    }
}