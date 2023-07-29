const request = require('supertest');
const jwt = require('jsonwebtoken');
const { User, Friend, Role } = require('../db');
const app = require('../server');

describe('Friend API', () => {
    let createdFriend;
    let testFriend;

    let testTokenUser1, testTokenUser2, testTokenUser3, testTokenUser4, testTokenUser5;
    let user1, user2, user3, user4, user5, friendRequest1, friendRequest2, role; 

    beforeAll(async () => {
        role = await Role.create({
            libelle : "test_role"
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

        const testUser1 = { id: user1.id, username: user1.login };
        const testUser2 = { id: user2.id, username: user2.login };
        const testUser3 = { id: user3.id, username: user3.login };
        const testUser4 = { id: user4.id, username: user4.login };
        const testUser5 = { id: user5.id, username: user5.login };

        testTokenUser1 = jwt.sign(testUser1, process.env.JWT_SECRET);
        testTokenUser2 = jwt.sign(testUser2, process.env.JWT_SECRET);
        testTokenUser3 = jwt.sign(testUser3, process.env.JWT_SECRET);
        testTokenUser4 = jwt.sign(testUser4, process.env.JWT_SECRET);
        testTokenUser5 = jwt.sign(testUser5, process.env.JWT_SECRET);

        friendRequest1 = await Friend.create({
            status: 'waiting',
            id_user: user1.id,
            id_user_receiver: user2.id
        });
    
        friendRequest2 = await Friend.create({
            status: 'accepted',
            id_user: user1.id,
            id_user_receiver: user3.id
        });
    });

    it('should fetch all friends', async () => {
        const res = await request(app)
            .get('/friends')
            .set('Authorization', `Bearer ${testTokenUser1}`)
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a new friend', async () => {
        testFriend = {
            "id_user": user4.id,
            "id_user_receiver": user5.id
          };
        const res = await request(app)
            .post('/friends')
            .set('Authorization', `Bearer ${testTokenUser4}`)
            .send(testFriend)
            .expect(201);
        createdFriend = res.body;
        expect(createdFriend).toHaveProperty('id');
    });

    it('should fetch a single friend', async () => {
        const res = await request(app)
            .get(`/friends/${createdFriend.id}`)
            .set('Authorization', `Bearer ${testTokenUser4}`)
            .expect(200);
        expect(res.body).toMatchObject(testFriend);
    });

    it('should update a friend', async () => {
        const updatedFriend = {"status": "accepted"};
        const res = await request(app)
            .patch(`/friends/${createdFriend.id}`)
            .set('Authorization', `Bearer ${testTokenUser4}`)
            .send(updatedFriend)
            .expect(200);
        expect(res.body).toMatchObject(updatedFriend);
    });

    it('should fetch all friends', async () => {
        const res = await request(app)
            .get(`/friends/${user1.id}/friends_list`)
            .set('Authorization', `Bearer ${testTokenUser1}`)
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should fetch a specific friendship by id', async () => {
        const res = await request(app)
            .get(`/friends/${friendRequest1.id}`)
            .set('Authorization', `Bearer ${testTokenUser1}`)
            .expect(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toEqual(friendRequest1.id);
    });

    it('should delete a friend', async () => {
        const res = await request(app)
            .delete(`/friends/${createdFriend.id}`)
            .set('Authorization', `Bearer ${testTokenUser4}`)
            .expect(204);
    });

    it('should fetch all pending friend requests', async () => {
        const res = await request(app)
            .get(`/friends/${user1.id}/pending`)
            .set('Authorization', `Bearer ${testTokenUser1}`)
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    afterAll(async () => {
        await User.destroy({ where: { id: user1.id }});
        await User.destroy({ where: { id: user2.id }});
        await User.destroy({ where: { id: user3.id }});
        await User.destroy({ where: { id: user4.id }});
        await User.destroy({ where: { id: user5.id }});
        await Role.destroy({ where: { id: role.id }});
        await Friend.destroy({ where: { id: friendRequest1.id }});
        await Friend.destroy({ where: { id: friendRequest2.id }});
        app.close();
    });
});
