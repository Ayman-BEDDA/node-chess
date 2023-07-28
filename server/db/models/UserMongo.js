const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id_user: { type: String, required: true },
    login: { type: String, required: true },
    elo: { type: Number, default: 500 },
    isBanned: { type: Boolean, default: false },
    isValid: { type: Boolean, default: false },
    lastDailyRewardDate: { type: Date, default: null },
    id_role: { type: String, default: 2 },
    isWaiting: { type: Boolean, default: false },
});
const UserModelMongo = mongoose.model('User', userSchema);

module.exports = UserModelMongo;