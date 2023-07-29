const UserController = require("../controllers/user");
const httpMocks = require("node-mocks-http");

jest.mock("../services/user", () => ({
  getLastGames: jest.fn(),
  getGameStats: jest.fn(),
  getBuys: jest.fn(),
  getFriends: jest.fn(),
}));

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getLastGames", () => {
    it("should get last games for a user", async () => {
      const userId = "1dea8ab9-cf25-4733-b923-d394261c38db";
      const req = httpMocks.createRequest({
        params: { id_user: userId },
      });
      const res = httpMocks.createResponse();

      const UserService = require("../services/user");

      const sampleGames = [
        { id: "1dea8ab9-cf25-4733-b923-d394261c38dc", GameStatus: "end", updatedAt: "2023-07-22T12:00:00Z", whiteUser: {}, blackUser: {}, winnerUser: {} },
        { id: "1dea8ab9-cf25-4733-b923-d394261c38dd", GameStatus: "end", updatedAt: "2023-07-21T12:00:00Z", whiteUser: {}, blackUser: {}, winnerUser: {} },
      ];
      UserService.getLastGames.mockResolvedValue(sampleGames);

      const Controller = UserController(UserService);

      await Controller.getLastGames(req, res);

      expect(UserService.getLastGames).toHaveBeenCalledWith(userId);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(sampleGames);
    });

    it("should handle errors when getting last games", async () => {
      const userId = "1dea8ab9-cf25-4733-b923-d394261c38db";
      const req = httpMocks.createRequest({
        params: { id_user: userId },
      });
      const res = httpMocks.createResponse();

      const UserService = require("../services/user");

      UserService.getLastGames.mockRejectedValue('Failed to retrieve the last 10 games for the user.');

      const Controller = UserController(UserService);

      await Controller.getLastGames(req, res);

      expect(UserService.getLastGames).toHaveBeenCalledWith(userId);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        error: "Failed to retrieve the last 10 games for the user.",
      });
    });
  });

  describe("getGameStats", () => {
    it("should get game statistics for a user", async () => {
      const userId = "1dea8ab9-cf25-4733-b923-d394261c38db";
      const req = httpMocks.createRequest({
        params: { id_user: userId },
      });
      const res = httpMocks.createResponse();

      const UserService = require("../services/user");

      const sampleGameStats = {
        nbGames: 2,
        nbWins: 1,
        nbLosses: 1,
        nbDraws: 0,
        winRate: 50,
      };
      UserService.getGameStats.mockResolvedValue(sampleGameStats);

      const Controller = UserController(UserService);

      await Controller.getGameStats(req, res);

      expect(UserService.getGameStats).toHaveBeenCalledWith(userId);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(sampleGameStats);
    });

    it("should handle errors when getting game statistics", async () => {
      const userId = "1dea8ab9-cf25-4733-b923-d394261c38db";
      const req = httpMocks.createRequest({
        params: { id_user: userId },
      });
      const res = httpMocks.createResponse();

      const UserService = require("../services/user");

      UserService.getGameStats.mockRejectedValue('Failed to retrieve the game statistics for the user.');

      const Controller = UserController(UserService);

      await Controller.getGameStats(req, res);

      expect(UserService.getGameStats).toHaveBeenCalledWith(userId);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        error: "Failed to retrieve the game statistics for the user.",
      });
    });
  });

  describe("getBuys", () => {
    it("should get buys for a user", async () => {
      const userId = "1dea8ab9-cf25-4733-b923-d394261c38db";
      const req = httpMocks.createRequest({
        params: { id_user: userId },
      });
      const res = httpMocks.createResponse();

      const UserService = require("../services/user");

      const sampleBuys = [
        { id: "1dea8ab9-cf25-4733-b923-d394261c38dd", id_user: "1dea8ab9-cf25-4733-b923-d394261c38db", id_article: "1dea8ab9-cf25-4733-b923-d394261c38df", date: "2023-07-22T12:00:00Z" },
        { id: "1dea8ab9-cf25-4733-b923-d394261c38de", id_user: "1dea8ab9-cf25-4733-b923-d394261c38db", id_article: "1dea8ab9-cf25-4733-b923-d394261c38df", date: "2023-07-21T12:00:00Z" },
      ];
      UserService.getBuys.mockResolvedValue(sampleBuys);

      const Controller = UserController(UserService);

      await Controller.getBuys(req, res);

      expect(UserService.getBuys).toHaveBeenCalledWith(userId);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(sampleBuys);
    });

    it("should handle errors when getting buys", async () => {
      const userId = "1dea8ab9-cf25-4733-b923-d394261c38db";
      const req = httpMocks.createRequest({
        params: { id_user: userId },
      });
      const res = httpMocks.createResponse();

      const UserService = require("../services/user");

      UserService.getBuys.mockRejectedValue('Failed to retrieve the buys for the user.');

      const Controller = UserController(UserService);

      await Controller.getBuys(req, res);

      expect(UserService.getBuys).toHaveBeenCalledWith(userId);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        error: "Failed to retrieve the buys for the user.",
      });
    });
  });

  describe("getFriends", () => {
    it("should get friends for a user", async () => {
      const userId = "1dea8ab9-cf25-4733-b923-d394261c38db";
      const req = httpMocks.createRequest({
        params: { id_user: userId },
      });
      const res = httpMocks.createResponse();

      const UserService = require("../services/user");

      const sampleFriends = [
        { id: "1dea8ab9-cf25-4733-b923-d394261c38dg", id_user: "1dea8ab9-cf25-4733-b923-d394261c38db", id_user_receiver: "1dea8ab9-cf25-4733-b923-d394261c38di", status: "accepted", date: "2023-06-22T12:00:00Z" },
        { id: "1dea8ab9-cf25-4733-b923-d394261c38dh", id_user: "1dea8ab9-cf25-4733-b923-d394261c38db", id_user_receiver: "1dea8ab9-cf25-4733-b923-d394261c38dj", status: "accepted", date: "2023-07-21T12:00:00Z" },
      ];
      UserService.getFriends.mockResolvedValue(sampleFriends);

      const Controller = UserController(UserService);

      await Controller.getFriends(req, res);

      expect(UserService.getFriends).toHaveBeenCalledWith(userId);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(sampleFriends);
    });

    it("should handle errors when getting friends", async () => {
      const userId = 1;
      const req = httpMocks.createRequest({
        params: { id_user: userId },
      });
      const res = httpMocks.createResponse();

      const UserService = require("../services/user");

      UserService.getFriends.mockRejectedValue('Failed to retrieve the friends for the user.');

      const Controller = UserController(UserService);

      await Controller.getFriends(req, res);

      expect(UserService.getFriends).toHaveBeenCalledWith(userId);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        error: "Failed to retrieve the friends for the user.",
      });
    });
  });
});
