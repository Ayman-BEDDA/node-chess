const request = require('supertest');
const app = require('../server');
const { Own, User, Article } = require('../db');

describe('Own API', () => {
    it('should claim daily rewards', async () => {
        const res = await request(app)
            .post('/owns')
            .expect(201);

        expect(res.body).toHaveProperty('id');

    });

    it('should buy premium money', async () => {
        const articleId = 5; // Remplacez par l'ID d'un article existant
        const res = await request(app)
            .post(`/owns/${articleId}/buy-money`)
            .expect(201);

        expect(res.body).toHaveProperty('id');
    });

    it('should fetch user owns', async () => {
        const res = await request(app)
            .get('/owns')
            .expect(200);

        // Effectuez des assertions pour vérifier la réponse de l'API
        expect(Array.isArray(res.body)).toBe(true);
        // Ajoutez d'autres assertions en fonction de la réponse attendue
    });

    afterAll(() => {
        app.close();
    });
});
