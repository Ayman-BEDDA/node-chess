require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
        },
        payMoney: async (req, res, next) => {
            const {articleEuros} = req.body;
            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price_data: {
                                currency: 'eur',
                                product_data: {
                                    name: "test",
                                },
                                unit_amount: articleEuros * 100,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: 'http://localhost:5173/shop',
                    cancel_url: 'http://localhost:5173/shop',
                });
                res.json({ sessionId: session.id });
            } catch (err) {
                next(err);
            }
        }
    }
}