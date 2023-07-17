const UserService = require("../services/user");
const { User, Own } = require("../db");

jest.mock("../db", () => ({
  User: {
    create: jest.fn(),
    destroy: jest.fn(),
  },
  Own: {
    bulkCreate: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a user and associated owns", async () => {
      const mockData = {
        login: "testUser",
        email: "testUser@example.com",
        password: "password123",
        // Ajoutez tous les autres champs nécessaires.
      };

      const mockUser = {
        ...mockData,
        id: 1,
        destroy: jest.fn(),
      };

      User.create.mockResolvedValue(mockUser);

      const service = UserService();

      await service.create(mockData);

      expect(User.create).toHaveBeenCalledWith(mockData);
      expect(Own.bulkCreate).toHaveBeenCalledWith([
        { id_user: mockUser.id, id_money: 1, amount: 0 },
        { id_user: mockUser.id, id_money: 2, amount: 0 },
      ]);
    });

    it("should handle errors and clean up created user and owns", async () => {
      const mockData = {
        login: "testUser",
        email: "testUser@example.com",
        password: "password123",
        // Ajoutez tous les autres champs nécessaires.
      };

      const mockError = new Error("Test error");

      User.create.mockRejectedValue(mockError);

      const service = UserService();

      await expect(service.create(mockData)).rejects.toThrow(mockError);

      expect(User.create).toHaveBeenCalledWith(mockData);
      expect(User.destroy).toHaveBeenCalled();
    });
  });
});
