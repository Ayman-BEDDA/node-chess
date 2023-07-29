// users.test.js
const request = require('supertest');
const app = require('../server');
const { User, Role, Game } = require('../db');

describe('User API', () => {
    let user1, user2, user3, user4, user5, role, game1, game2, game3, game4, game5;
    beforeAll(async () => {
        role = await Role.create({
            libelle: 'test_role'
        });
        user1 = await User.create({
            login: 'user1',
            email: 'user1@example.com',
            password: 'azertytest',
            elo: 500,
            media: 'default.png',
            isBanned: false,
            isValid: true,
            id_role: role.id
        });

        user2 = await User.create({
            login: 'user2',
            email: 'user2@example.com',
            password: 'azertytest',
            elo: 500,
            media: 'default.png',
            isBanned: false,
            isValid: true,
            id_role: role.id
        });

        user3 = await User.create({
            login: 'user3',
            email: 'user3@example.com',
            password: 'azertytest',
            elo: 500,
            media: 'default.png',
            isBanned: false,
            isValid: true,
            id_role: role.id
        });

        user4 = await User.create({
            login: 'Muthu',
            email: 'muthu@example.com',
            password: 'azertytest',
            elo: 500,
            media: 'default.png',
            isBanned: false,
            isValid: true,
            id_role: role.id
        });

        user5 = await User.create({
            login: 'Ayman',
            email: 'ayman@example.com',
            password: 'azertytest',
            elo: 500,
            media: 'default.png',
            isBanned: false,
            isValid: true,
            id_role: role.id
        });

        game1 = await Game.create({
            BlackUserID: user1.id,
            GameStatus : "end",
            WhiteUserID : user2.id,
            Winner: user1.id
        });

        game2 = await Game.create({
            BlackUserID: user1.id,
            GameStatus : "end",
            WhiteUserID : user4.id,
            Winner: user4.id
        });

        game3 = await Game.create({
            BlackUserID: user1.id,
            GameStatus : "end",
            WhiteUserID : user5.id,
            Winner: null
        });

        game4 = await Game.create({
            BlackUserID: user1.id,
            GameStatus : "end",
            WhiteUserID : user3.id,
            Winner: user3.id
        });

        game5 = await Game.create({
            BlackUserID: user1.id,
            GameStatus : "end",
            WhiteUserID : user2.id,
            Winner: user1.id
        });

    });

    it('should fetch the last games for a user', async () => {
        const response = await request(app).get(`/users/${user1.id}/lastgames`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fetch the game statistics for a user', async () => {
        const response = await request(app).get(`/users/${user1.id}/gamestats`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            nbGames: 5,
            nbWins: 2,
            nbLosses: 2,
            nbDraws: 1,
            winRate: 40
        });
    });

    it('should fetch the friends for a user', async () => {
        const response = await request(app).get(`/users/${user1.id}/friends`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fetch the buys for a user', async () => {
        const response = await request(app).get(`/users/${user1.id}/buys`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    afterAll(async () => {
        await Game.destroy({ where: { id: [game1.id, game2.id, game3.id, game4.id, game5.id] } });
        await User.destroy({ where: { id: [user1.id, user2.id, user3.id, user4.id, user5.id] } });
    
        app.close();
    });
});
