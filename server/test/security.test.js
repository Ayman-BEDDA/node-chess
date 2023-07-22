const SecurityController = require("../controllers/security");
const httpMocks = require("node-mocks-http");
const jwt = require("jsonwebtoken");

jest.mock("../mailers/mailer", () => ({
  sendVerificationEmail: jest.fn(),
  sendForgotPasswordEmail: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("SecurityController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUserService = {
    login: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();
  const next = jest.fn();

  describe("login", () => {
    it("should log in the user and return a JWT token", async () => {
      const mockUser = {
        id: 1,
        login: "testuser",
        id_role: 2,
        isValid: true,
        isBanned: false,
        lastDailyRewardDate: null,
      };
      const mockToken = "mockJWTToken";
      req.body = {
        email: "test@example.com",
        password: "testpassword",
      };
      mockUserService.login.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(mockToken);

      const controller = SecurityController(mockUserService);
      await controller.login(req, res, next);

      expect(mockUserService.login).toHaveBeenCalledWith(
        req.body.email,
        req.body.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          login: mockUser.login,
          id_role: mockUser.id_role,
          isValid: mockUser.isValid,
          isBanned: mockUser.isBanned,
          lastDailyRewardDate: mockUser.lastDailyRewardDate,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ token: mockToken });
    });

    it("should call the 'next' middleware with an error if login fails", async () => {
      req.body = {
        email: "test@example.com",
        password: "invalidpassword",
      };
      const error = new Error("Invalid credentials");
      mockUserService.login.mockRejectedValue(error);

      const controller = SecurityController(mockUserService);
      await controller.login(req, res, next);

      expect(mockUserService.login).toHaveBeenCalledWith(
        req.body.email,
        req.body.password
      );
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // Add tests for other functions like 'logout', 'register', 'verify', 'forgotPassword', 'resetPassword' in a similar manner.

});
