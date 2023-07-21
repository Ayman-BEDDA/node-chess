const request = require('supertest');
const { User, Friend, Role } = require('../db');
const app = require('../server');

describe('Friend API', () => {
    let createdFriend;
    let testFriend;

    let user1, user2, user3, user4, user5, friendRequest1, friendRequest2, role; 
    beforeAll(async () => {
        role = await Role.create({
            libelle : "test_role"
        });
        user1 = await User.create({
            login: 'user1',
            email: 'user1@example.com',
            password: 'azerty',
            elo: 500,
            media: 'default.png',
            isBanned: false,
            isValid: true,
            id_role: role.id
        });

        user2 = await User.create({
            login: 'user2',
            email: 'user2@example.com',
            password: 'azerty',
            elo: 500,
            media: 'default.png',
            isBanned: false,
            isValid: true,
            id_role: role.id
        });

        user3 = await User.create({
            login: 'user3',
            email: 'user3@example.com',
            password: 'azerty',
            elo: 500,
            media: 'default.png',
            isBanned: false,
            isValid: true,
            id_role: role.id
        });

        user4 = await User.create({
            login: 'Muthu',
            email: 'muthu@example.com',
            password: 'azerty',
            elo: 500,
            media: 'default.png',
            isBanned: false,
            isValid: true,
            id_role: role.id
        });

        user5 = await User.create({
            login: 'Ayman',
            email: 'ayman@example.com',
            password: 'azerty',
            elo: 500,
            media: 'default.png',
            isBanned: false,
            isValid: true,
            id_role: role.id
        });

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

    //VALID
    it('should fetch all friends', async () => {
        const res = await request(app)
            .get('/friends')
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    //VALID
    it('should create a new friend', async () => {
        testFriend = {
            "id_user": user4.id,
            "id_user_receiver": user5.id
          };
        const res = await request(app)
            .post('/friends')
            .send(testFriend)
            .expect(201);
        createdFriend = res.body;
        expect(createdFriend).toHaveProperty('id');
    });

    //VALID
    it('should fetch a single friend', async () => {
        const res = await request(app)
            .get(`/friends/${createdFriend.id}`)
            .expect(200);
        expect(res.body).toMatchObject(testFriend);
    });

    //VALID
    it('should update a friend', async () => {
        const updatedFriend = {"status": "accepted"};
        const res = await request(app)
            .patch(`/friends/${createdFriend.id}`)
            .send(updatedFriend)
            .expect(200);
        expect(res.body).toMatchObject(updatedFriend);
    });

    //VALID
    it('should fetch all friends', async () => {
        const res = await request(app)
            .get(`/friends/${user1.id}/friends_list`)
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    //VALID
    it('should fetch a specific friendship by id', async () => {
        const friendshipId = 1;
        const res = await request(app)
            .get(`/friends/${friendshipId}`)
            .expect(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toEqual(friendshipId);
    });
    

    it('should delete a friend', async () => {
        const res = await request(app)
            .delete(`/friends/${createdFriend.id}`)
            .expect(204);
    });

    //VALIDgit
    it('should fetch all pending friend requests', async () => {
        const res = await request(app)
            .get(`/friends/${user1.id}/pending`)
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    /*it('should accept a friend request', async () => {
         const res = await request(app)
             .patch(`/friends/${friendRequest1.id_user}/accept/${friendRequest1.id_user_receiver}`)
             .expect(200);
        console.log(friendRequest1.id_user + " " + friendRequest1.id_user_receiver);
        console.log(res);
        expect(res.body.status).toBe('accepted');
    });*/

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