const request = require('supertest');
const { Article } = require('../db');
const app = require('../server');

describe('Article API', () => {
    let testArticle;
    let testArticle1, testArticle2;

    beforeAll(async () => {
        testArticle1 = await Article.create({
            libelle: 'Test Article 1',
            price: 9.99,
            media: 'article1.jpg',
            euros: 10,
        });

        testArticle2 = await Article.create({
            libelle: 'Test Article 2',
            price: 19.99,
            media: 'article2.jpg',
            euros: 20,
        });
    });

    it('should fetch all articles', async () => {
        const res = await request(app)
            .get('/articles')
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a new article', async () => {
        testArticle = {
            "libelle": 'Test Article 1',
            "price": 9.99,
            "media": 'article1.jpg',
            "euros": 10
        };
        const res = await request(app)
          .post('/articles')
          .send(testArticle)
          .expect(201);
    
        createdArticle = res.body;
        expect(createdArticle).toHaveProperty('id');
        expect(createdArticle.libelle).toBe(testArticle.libelle);
    });

    it('should fetch a single article', async () => {
        const res = await request(app)
            .get(`/articles/${createdArticle.id}`)
            .expect(200);
        expect(res.body).toMatchObject(testArticle);
    });

    it('should update an article', async () => {
        const updatedArticle = {
          libelle: 'Updated Article',
          price: 14.99,
        };
    
        const res = await request(app)
          .patch(`/articles/${createdArticle.id}`)
          .send(updatedArticle)
          .expect(200);
    
        expect(res.body.libelle).toBe(updatedArticle.libelle);
        expect(res.body.price).toBe(updatedArticle.price);
    });

    it('should delete an article', async () => {
        await request(app)
          .delete(`/articles/${createdArticle.id}`)
          .expect(204);
      });
    
    afterAll(async () => {
        await testArticle1.destroy();
        await testArticle2.destroy();
        app.close();
    });
});
