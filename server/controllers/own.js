module.exports = function OwnController(OwnService) {
    return {
        dailyRewards: async (req, res, next) => {
            const id_user = req.user.id;
            try {
                const result = await OwnService.dailyRewards(id_user);
                res.status(201).json(result);
            } catch (err) {
                next(err);
            }
        },
        buyPremiumMoney: async (req, res, next) => {
            const id_article = req.params.idArticle;
            const id_user = req.user.id;
            try {
                await OwnService.buyPremiumMoney(id_user, id_article);
                res.sendStatus(201);
            } catch (err) {
                next(err);
            }
        },
        getOwns: async (req, res, next) => {
            const id_user = req.user.id;
            try {
                const owns = await OwnService.getOwns(id_user);
                res.status(200).json(owns);
            } catch (err) {
                next(err);
            }
        }
    }
}