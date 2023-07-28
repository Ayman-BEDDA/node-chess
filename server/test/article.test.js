const ArticleController = require("../controllers/article");
const httpMocks = require("node-mocks-http");

jest.mock("../services/article", () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  replace: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  buyArticle: jest.fn(),
  getArticlesMoney: jest.fn(),
}));

describe("ArticleController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return a list of articles", async () => {
      const req = httpMocks.createRequest({ query: { page: 1, itemsPerPage: 10 } });
      const res = httpMocks.createResponse();

      const ArticleService = require("../services/article");
      const mockArticles = [{ id: 1, libelle: "Article 1", price: 10 }, { id: 2, libelle: "Article 2", price: 15 }];
      ArticleService.findAll.mockResolvedValue(mockArticles);

      const Controller = ArticleController(ArticleService);

      await Controller.getAll(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockArticles);
    });

    it("should handle errors and call the next middleware", async () => {
      const req = httpMocks.createRequest({ query: { page: 1, itemsPerPage: 10 } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const ArticleService = require("../services/article");
      ArticleService.findAll.mockRejectedValue(new Error("Database error"));

      const Controller = ArticleController(ArticleService);

      await Controller.getAll(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("getOne", () => {
    it("should return an article by ID", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" } });
      const res = httpMocks.createResponse();

      const ArticleService = require("../services/article");
      const mockArticle = { id: 1, libelle: "Article 1", price: 10 };
      ArticleService.findOne.mockResolvedValue(mockArticle);

      const Controller = ArticleController(ArticleService);

      await Controller.getOne(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockArticle);
    });

    it("should return 404 if article is not found", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" } });
      const res = httpMocks.createResponse();

      const ArticleService = require("../services/article");
      ArticleService.findOne.mockResolvedValue(null);

      const Controller = ArticleController(ArticleService);

      await Controller.getOne(req, res);

      expect(res.statusCode).toBe(404);
    });

    it("should handle errors and call the next middleware", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const ArticleService = require("../services/article");
      ArticleService.findOne.mockRejectedValue(new Error("Database error"));

      const Controller = ArticleController(ArticleService);

      await Controller.getOne(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("create", () => {
    it("should create a new article", async () => {
      const req = httpMocks.createRequest({ body: { libelle: "New Article", price: 20 } });
      const res = httpMocks.createResponse();

      const ArticleService = require("../services/article");
      const mockArticle = { id: 1, libelle: "New Article", price: 20 };
      ArticleService.create.mockResolvedValue(mockArticle);

      const Controller = ArticleController(ArticleService);

      await Controller.create(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockArticle);
    });

    it("should handle errors and call the next middleware", async () => {
      const req = httpMocks.createRequest({ body: { libelle: "New Article", price: 20 } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const ArticleService = require("../services/article");
      ArticleService.create.mockRejectedValue(new Error("Database error"));

      const Controller = ArticleController(ArticleService);

      await Controller.create(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("update", () => {
    it("should update an existing article", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" }, body: { price: 30 } });
      const res = httpMocks.createResponse();

      const ArticleService = require("../services/article");
      const mockArticle = { id: 1, libelle: "Article 1", price: 30 };
      ArticleService.update.mockResolvedValue([mockArticle]);

      const Controller = ArticleController(ArticleService);

      await Controller.update(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockArticle);
    });

    it("should return 404 if article is not found", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" }, body: { price: 30 } });
      const res = httpMocks.createResponse();

      const ArticleService = require("../services/article");
      ArticleService.update.mockResolvedValue([null]);

      const Controller = ArticleController(ArticleService);

      await Controller.update(req, res);

      expect(res.statusCode).toBe(404);
    });

    it("should handle errors and call the next middleware", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" }, body: { price: 30 } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const ArticleService = require("../services/article");
      ArticleService.update.mockRejectedValue(new Error("Database error"));

      const Controller = ArticleController(ArticleService);

      await Controller.update(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("delete", () => {
    it("should delete an existing article", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" } });
      const res = httpMocks.createResponse();

      const ArticleService = require("../services/article");
      ArticleService.delete.mockResolvedValue(1);

      const Controller = ArticleController(ArticleService);

      await Controller.delete(req, res);

      expect(res.statusCode).toBe(204);
    });

    it("should return 404 if article is not found", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" } });
      const res = httpMocks.createResponse();

      const ArticleService = require("../services/article");
      ArticleService.delete.mockResolvedValue(0);

      const Controller = ArticleController(ArticleService);

      await Controller.delete(req, res);

      expect(res.statusCode).toBe(404);
    });

    it("should handle errors and call the next middleware", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const ArticleService = require("../services/article");
      ArticleService.delete.mockRejectedValue(new Error("Database error"));

      const Controller = ArticleController(ArticleService);

      await Controller.delete(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("buyArticle", () => {
    it("should buy an article for a user", async () => {
        const req = httpMocks.createRequest({ params: { idArticle: "1" }, user: { id: 123 } });
        const res = httpMocks.createResponse();
    
        const ArticleService = require("../services/article");
        const mockBuyResult = { id: 1, articleId: "1", userId: 123, createdAt: new Date() };
        ArticleService.buyArticle.mockResolvedValue(mockBuyResult);
    
        const Controller = ArticleController(ArticleService);
    
        await Controller.buyArticle(req, res);
    
        mockBuyResult.createdAt = mockBuyResult.createdAt.toISOString();
    
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual(mockBuyResult);
    });

    it("should handle errors and call the next middleware", async () => {
      const req = httpMocks.createRequest({ params: { idArticle: "1" }, user: { id: 123 } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const ArticleService = require("../services/article");
      ArticleService.buyArticle.mockRejectedValue(new Error("Database error"));

      const Controller = ArticleController(ArticleService);

      await Controller.buyArticle(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("getArticlesMoney", () => {
    it("should return articles with a specific money ID", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      const ArticleService = require("../services/article");
      const mockArticles = [{ id: 1, libelle: "Article 1", price: 10 }, { id: 2, libelle: "Article 2", price: 15 }];
      ArticleService.getArticlesMoney.mockResolvedValue(mockArticles);

      const Controller = ArticleController(ArticleService);

      await Controller.getArticlesMoney(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockArticles);
    });

    it("should handle errors and call the next middleware", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const ArticleService = require("../services/article");
      ArticleService.getArticlesMoney.mockRejectedValue(new Error("Database error"));

      const Controller = ArticleController(ArticleService);

      await Controller.getArticlesMoney(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });
});
