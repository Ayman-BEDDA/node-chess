// securityHttp.test.js
const request = require('supertest');
const app = require('../server');
const { User, Role } = require('../db');
const { sendVerificationEmail, sendForgotPasswordEmail } = require('../mailers/mailer');
const jwt = require('jsonwebtoken');

jest.mock('../mailers/mailer', () => ({
    sendVerificationEmail: jest.fn(),
    sendForgotPasswordEmail: jest.fn(),
  }));


describe('Security API', () => {
    let newUser;
    let user1, user2, user3, user4, user5, role
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
            id_role: role.id,
            token: null
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
    });

    it('should login a user', async () => {
        const res = await request(app).post('/login').send({
            email: user1.email,
            password: 'azertytest'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login a user with wrong password', async () => {
        const res = await request(app).post('/login').send({
            email: user1.email,
            password: 'wrongpassword'
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body).toEqual(expect.objectContaining({ error: "Invalid credentials" }));
    });

    it('should not login a user with wrong email', async () => {
        const res = await request(app).post('/login').send({
            email: 'wrongemail@test.fr',
            password: 'azertytest'
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body).toEqual(expect.objectContaining({ error: "Invalid credentials" }));
    });

    it('should not login a user with wrong email and password', async () => {
        const res = await request(app).post('/login').send({
            email: 'wrongemail@test.fr',
            password: 'wrongpassword'
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body).toEqual(expect.objectContaining({ error: "Invalid credentials" }));

    });

    it('should log out a user', async () => {
        const res = await request(app).post('/logout').send({});
    
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Vous êtes déconnecté.' });
    });

    it('should register a user', async () => {
        newUser = {
            login: 'newuser123',
            email: 'newuser@example.com',
            password: 'newuserpassword',
        };

        const res = await request(app)
        .post('/register')
        .send(newUser)
        .expect(201);

        expect(sendVerificationEmail).toHaveBeenCalledTimes(1);
        expect(sendVerificationEmail).toHaveBeenCalledWith(newUser.email, expect.any(String));
      // Vérifier la réponse renvoyée par l'API
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Votre compte a été créé avec succès. Veuillez vérifier votre boîte de réception pour activer votre compte.');
    });

    it('should not register a user with an existing email', async () => {
        const res = await request(app).post('/register').send({
            login: 'MarksLander21',
            email: user2.email,
            password: 'azertytest',
        });

        expect(res.statusCode).toEqual(409);        
    });

    it('should verify a user after registration', async () => {
        const user = await User.findOne({ where: { email: newUser.email } });
        const res = await request(app).get(`/verify/${user.token}`).send({});

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Votre compte a été activé avec succès.' });
    });

    it('should not verify a user with a wrong token', async () => {
        const res = await request(app).get('/verify/wrongtoken').send({});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Token invalide.');
    });

    it('should send a forgot password email', async () => {
        const res = await request(app).post('/forgot-password').send({
            email: user3.email
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Veuillez vérifier votre boîte de réception pour réinitialiser votre mot de passe.' });
        expect(sendForgotPasswordEmail).toHaveBeenCalledTimes(1);
        expect(sendForgotPasswordEmail).toHaveBeenCalledWith(user3.email, expect.any(String));
    });

    it('should not send a forgot password email with a wrong email', async () => {
        const res = await request(app).post('/forgot-password').send({
            email: 'wrongemail@exemple.com'
        });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({ error: 'Utilisateur non trouvé.' });
    });

    it('should reset a user password', async () => {
        const user = await User.findOne({ where: { email: user3.email } });
        const res = await request(app).post(`/reset-password/${user.token}`).send({
            password: 'newpassword'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Votre mot de passe a été réinitialisé avec succès!' });
    });

    it('should not reset a user password with a wrong token', async () => {
        const res = await request(app).post('/reset-password/wrongtoken').send({
            password: 'newpassword'
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ error: 'Token invalide.' });
    });

    it('should not reset a user password for a non-existent user', async () => {
        const token = jwt.sign({ userId: 'non_existent_user_id' }, process.env.JWT_SECRET);
    
        const res = await request(app).post(`/reset-password/${token}`).send({
            password: 'newpassword'
        });
    
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({ error: 'Utilisateur non trouvé.' });
    });

    afterEach(async () => {
        if (newUser && newUser.id) {
            await User.destroy({ where: { id: newUser.id } });
        }
    });

    afterAll(async () => {
        await User.destroy({ where: { id: [user1.id, user2.id, user3.id, user4.id, user5.id] } });
        await User.destroy({ where: { email: 'newuser@example.com' } });
        await Role.destroy({ where: { id: role.id } });
        
        app.close();
    });

});
