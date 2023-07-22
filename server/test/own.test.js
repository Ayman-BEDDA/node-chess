const OwnController = require("../controllers/own");
const httpMocks = require("node-mocks-http");

jest.mock("../services/own", () => ({
  dailyRewards: jest.fn(),
  buyPremiumMoney: jest.fn(),
  getOwns: jest.fn(),
}));

describe("OwnController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("dailyRewards", () => {
    it("should return the daily rewards for a user", async () => {
      const req = httpMocks.createRequest({ user: { id: 123 } });
      const res = httpMocks.createResponse();

      const OwnService = require("../services/own");
      const mockRewards = { coins: 100, gems: 10 };
      OwnService.dailyRewards.mockResolvedValue(mockRewards);

      const Controller = OwnController(OwnService);

      await Controller.dailyRewards(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockRewards);
    });

    it("should handle errors and call the next middleware", async () => {
      const req = httpMocks.createRequest({ user: { id: 123 } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const OwnService = require("../services/own");
      OwnService.dailyRewards.mockRejectedValue(new Error("Database error"));

      const Controller = OwnController(OwnService);

      await Controller.dailyRewards(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("buyPremiumMoney", () => {
    it("should allow a user to buy premium money", async () => {
      const req = httpMocks.createRequest({ params: { idArticle: "1" }, user: { id: 123 } });
      const res = httpMocks.createResponse();

      const OwnService = require("../services/own");
      OwnService.buyPremiumMoney.mockResolvedValue();

      const Controller = OwnController(OwnService);

      await Controller.buyPremiumMoney(req, res);

      expect(res.statusCode).toBe(201);
    });

    it("should handle errors and call the next middleware", async () => {
      const req = httpMocks.createRequest({ params: { idArticle: "1" }, user: { id: 123 } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const OwnService = require("../services/own");
      OwnService.buyPremiumMoney.mockRejectedValue(new Error("Database error"));

      const Controller = OwnController(OwnService);

      await Controller.buyPremiumMoney(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("getOwns", () => {
    it("should return the owned items for a user", async () => {
      const req = httpMocks.createRequest({ user: { id: 123 } });
      const res = httpMocks.createResponse();

      const OwnService = require("../services/own");
      const mockOwns = [
        { id: 1, amount: 10, id_money: 1, id_user: 123 },
        { id: 2, amount: 5, id_money: 2, id_user: 123 },
      ];
      OwnService.getOwns.mockResolvedValue(mockOwns);

      const Controller = OwnController(OwnService);

      await Controller.getOwns(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockOwns);
    });

    it("should handle errors and call the next middleware", async () => {
      const req = httpMocks.createRequest({ user: { id: 123 } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const OwnService = require("../services/own");
      OwnService.getOwns.mockRejectedValue(new Error("Database error"));

      const Controller = OwnController(OwnService);

      await Controller.getOwns(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });
});
