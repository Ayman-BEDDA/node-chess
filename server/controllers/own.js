module.exports = function OwnController(OwnService) {
    return {
        dailyRewards: async (req, res, next) => {
            const id_user = req.user.id;
            try {
                await OwnService.dailyRewards(id_user);
                res.sendStatus(200);
            } catch (err) {
                next(err);
            }
        },
        buyPremiumMoney: async (req, res, next) => {
            const id_article = req.params.idArticle;
            const id_user = req.user.id;
            try {
                await OwnService.buyPremiumMoney(id_user, id_article);
                res.sendStatus(200);
            } catch (err) {
                next(err);
            }
        }
    }
}