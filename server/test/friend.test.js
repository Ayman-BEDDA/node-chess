const FriendController = require("../controllers/friend");
const httpMocks = require("node-mocks-http");

jest.mock("../services/friend", () => ({
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
}));

describe("FriendController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("send", () => {
    it("should send a friend request", async () => {
      const req = httpMocks.createRequest({
        params: { id: "1", id_receiver: "2" },
      });
      const res = httpMocks.createResponse();

      const FriendService = require("../services/friend");

      FriendService.create.mockResolvedValue(true);

      const Controller = FriendController(FriendService);

      await Controller.send(req, res);

      expect(FriendService.create).toHaveBeenCalledWith({
        id_user: "1",
        id_user_receiver: "2",
        status: "waiting",
        date: expect.any(Date),
      });
      expect(res.statusCode).toBe(201);
    });
  });

  describe("deny", () => {
    it("should deny a friend request", async () => {
      const req = httpMocks.createRequest({
        params: { id: "1", id_receiver: "2" },
      });
      const res = httpMocks.createResponse();

      const FriendService = require("../services/friend");

      FriendService.update.mockResolvedValue(true);

      const Controller = FriendController(FriendService);

      await Controller.deny(req, res);

      expect(FriendService.update).toHaveBeenCalledWith(
        { id_user: "1", id_user_receiver: "2" },
        { status: "denied" }
      );
      expect(res.statusCode).toBe(200);
    });
  });

  describe("accept", () => {
    it("should accept a friend request", async () => {
      const req = httpMocks.createRequest({
        params: { id: "1", id_receiver: "2" },
      });
      const res = httpMocks.createResponse();

      const FriendService = require("../services/friend");

      FriendService.update.mockResolvedValue(true);

      const Controller = FriendController(FriendService);

      await Controller.accept(req, res);

      expect(FriendService.update).toHaveBeenCalledWith(
        { id_user: "1", id_user_receiver: "2" },
        { status: "accepted" }
      );
      expect(res.statusCode).toBe(200);
    });
  });

  describe("friends_list", () => {
    it("should return the friends list of a user", async () => {
      const req = httpMocks.createRequest({
        params: { id: "1" },
      });
      const res = httpMocks.createResponse();

      const FriendService = require("../services/friend");

      FriendService.findAll.mockResolvedValue([]);

      const Controller = FriendController(FriendService);

      await Controller.friends_list(req, res);

      expect(FriendService.findAll).toHaveBeenCalledWith({
        id_user: parseInt("1", 10),
        status: "accepted",
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe("pending", () => {
    it("should return the pending friend requests of a user", async () => {
      const req = httpMocks.createRequest({
        params: { id: "1" },
      });
      const res = httpMocks.createResponse();

      const FriendService = require("../services/friend");

      FriendService.findAll.mockResolvedValue([]);

      const Controller = FriendController(FriendService);

      await Controller.pending(req, res);

      expect(FriendService.findAll).toHaveBeenCalledWith({
        id_user_receiver: parseInt("1", 10),
        status: "waiting",
      });
      expect(res.statusCode).toBe(200);
    });
  });
});