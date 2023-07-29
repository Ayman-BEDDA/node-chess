const SecurityController = require("../controllers/security");
const httpMocks = require("node-mocks-http");
const jwt = require("jsonwebtoken");
const mailer = require("../mailers/mailer");

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
        id: "1dea8ab9-cf25-4733-b923-d394261c38db",
        login: "testuser",
        id_role: "1dea8ab9-cf25-4733-b923-d394261c38dc",
        isValid: true,
        isBanned: false,
        lastDailyRewardDate: null,
        elo: 667, 
        role: { libelle: "Test role" }
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
          elo: mockUser.elo,
          role_libelle: mockUser.role.libelle
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

  describe("register", () => {
    it("should register a new user and send verification email", async () => {
      const mockUser = {
        id: "1dea8ab9-cf25-4733-b923-d394261c38db",
        login: "testuser",
        email: "test@example.com",
        password: "testpassword",
        token: null,
        save: jest.fn(),
      };
      const mockToken = "mockJWTToken";

      req.body = {
        login: "testuser",
        email: "test@example.com",
        password: "testpassword",
      };
      mockUserService.findOne.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(mockToken);

      const controller = SecurityController(mockUserService);
      await controller.register(req, res, next);

      expect(mockUserService.findOne).toHaveBeenCalledWith({
        email: req.body.email,
      });
      expect(mockUserService.create).toHaveBeenCalledWith({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      expect(mockUser.token).toBe(mockToken);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mailer.sendVerificationEmail).toHaveBeenCalledWith(
        req.body.email,
        mockUser.token
      );
      expect(res.statusCode).toBe(201);
      expect(res._getData()).toMatch(
        "Votre compte a été créé avec succès. Veuillez vérifier votre boîte de réception pour activer votre compte."
      );
    });

    it("should return 409 if user with email already exists", async () => {
      const req = httpMocks.createRequest({
        body: {
          login: "existing_user",
          email: "existing@example.com",
          password: "testpassword",
        },
      });      
      const res = httpMocks.createResponse();

      mockUserService.findOne.mockResolvedValue({
        email: "existing@example.com",
      });

      const controller = SecurityController(mockUserService);
      await controller.register(req, res, next);

      expect(res.statusCode).toBe(409);
      expect(res._getData()).toEqual({error: "Un utilisateur avec cette adresse e-mail existe déjà."});
    });

    it("should call the 'next' middleware with an error if registration fails", async () => {
      const req = httpMocks.createRequest({
        body: {
          login: "new_user",
          email: "new@example.com",
          password: "testpassword",
        },
      });
      
      const res = httpMocks.createResponse();
      const next = jest.fn();
      const error = new Error("Registration failed");

      mockUserService.findOne.mockResolvedValue(null);
      mockUserService.create.mockRejectedValue(error);

      const controller = SecurityController(mockUserService);
      await controller.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("logout", () => {
    it("should logout the user successfully", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
  
      const controller = SecurityController(mockUserService);
      await controller.logout(req, res, next);
  
      expect(res.statusCode).toBe(200);
      expect(res._getData()).toBe("{\"message\":\"Vous êtes déconnecté.\"}");
    });
  });

  describe("verify", () => {
    it("should verify the user account and mark it as valid", async () => {
      const mockUser = {
        email: "test@example.com",
        isValid: false,
        save: jest.fn(),
      };
      const mockDecoded = { email: "test@example.com" };
      const req = httpMocks.createRequest({ params: { token: "mockToken" } });
      const res = httpMocks.createResponse();

      jwt.verify.mockReturnValue(mockDecoded);
      mockUserService.findOne.mockResolvedValue(mockUser);

      const controller = SecurityController(mockUserService);
      await controller.verify(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        req.params.token,
        process.env.JWT_SECRET
      );
      expect(mockUserService.findOne).toHaveBeenCalledWith({
        email: mockDecoded.email,
      });
      expect(mockUser.isValid).toBe(true);
      expect(mockUser.token).toBeNull();
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getData()).toBe("{\"message\":\"Votre compte a été activé avec succès.\"}");
    });

    it("should return 404 if user is not found", async () => {
      const mockDecoded = { email: "test@example.com" };
      const req = httpMocks.createRequest({ params: { token: "mockToken" } });
      const res = httpMocks.createResponse();

      jwt.verify.mockReturnValue(mockDecoded);
      mockUserService.findOne.mockResolvedValue(null);

      const controller = SecurityController(mockUserService);
      await controller.verify(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toBe("{\"error\":\"Utilisateur non trouvé.\"}");
    });

    it("should return 400 if token is invalid", async () => {
      const req = httpMocks.createRequest({ params: { token: "invalidToken" } });
      const res = httpMocks.createResponse();

      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const controller = SecurityController(mockUserService);
      await controller.verify(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toBe("{\"error\":\"Token invalide.\"}");
    });

    it("should return 400 if account is already verified", async () => {
      const mockUser = {
        email: "test@example.com",
        isValid: true,
      };
      const mockDecoded = { email: "test@example.com" };
      const req = httpMocks.createRequest({ params: { token: "mockToken" } });
      const res = httpMocks.createResponse();

      jwt.verify.mockReturnValue(mockDecoded);
      mockUserService.findOne.mockResolvedValue(mockUser);

      const controller = SecurityController(mockUserService);
      await controller.verify(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toBe("{\"error\":\"Votre compte a déjà été vérifié.\"}");
    });
  });

  describe("forgotPassword", () => {
    it("should send a forgot password email to the user", async () => {
      const mockUser = {
        email: "test@example.com",
        save: jest.fn(),
      };
      const req = httpMocks.createRequest({ body: { email: "test@example.com" } });
      const res = httpMocks.createResponse();

      mockUserService.findOne.mockResolvedValue(mockUser);

      const controller = SecurityController(mockUserService);
      await controller.forgotPassword(req, res, next);

      expect(mockUserService.findOne).toHaveBeenCalledWith({
        email: req.body.email,
      });
      expect(mockUser.token).not.toBeNull();
      expect(mockUser.save).toHaveBeenCalled();
      expect(mailer.sendForgotPasswordEmail).toHaveBeenCalledWith(
        req.body.email,
        mockUser.token
      );
      expect(res.statusCode).toBe(200);
      expect(res._getData()).toBe("{\"message\":\"Veuillez vérifier votre boîte de réception pour réinitialiser votre mot de passe.\"}");

    });

    it("should return 404 if user is not found", async () => {
      const req = httpMocks.createRequest({ body: { email: "test@example.com" } });
      const res = httpMocks.createResponse();

      mockUserService.findOne.mockResolvedValue(null);

      const controller = SecurityController(mockUserService);
      await controller.forgotPassword(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toBe("{\"error\":\"Utilisateur non trouvé.\"}");
    });
  });

  describe("resetPassword", () => {
    it("should reset the user's password and remove the token", async () => {
      const mockUser = {
        token: "mockToken",
        save: jest.fn(),
      };
      const mockDecoded = { email: "test@example.com" };
      const req = httpMocks.createRequest({
        params: { token: "mockToken" },
        body: { password: "newpassword" },
      });
      const res = httpMocks.createResponse();

      jwt.verify.mockReturnValue(mockDecoded);
      mockUserService.findOne.mockResolvedValue(mockUser);

      const controller = SecurityController(mockUserService);
      await controller.resetPassword(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        req.params.token,
        process.env.JWT_SECRET
      );
      expect(mockUserService.findOne).toHaveBeenCalledWith({
        token: req.params.token,
      });
      expect(mockUser.password).toBe(req.body.password);
      expect(mockUser.token).toBeNull();
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getData()).toBe("{\"message\":\"Votre mot de passe a été réinitialisé avec succès!\"}");
    });

    it("should return 404 if user is not found", async () => {
      const req = httpMocks.createRequest({
        params: { token: "mockToken" },
        body: { password: "newpassword" },
      });
      const res = httpMocks.createResponse();

      jwt.verify.mockReturnValue({ email: "test@example.com" });
      mockUserService.findOne.mockResolvedValue(null);

      const controller = SecurityController(mockUserService);
      await controller.resetPassword(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toBe("{\"error\":\"Utilisateur non trouvé.\"}");
    });

    it("should return 400 if token is invalid", async () => {
      const req = httpMocks.createRequest({
        params: { token: "invalidToken" },
        body: { password: "newpassword" },
      });
      const res = httpMocks.createResponse();

      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const controller = SecurityController(mockUserService);
      await controller.resetPassword(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toBe("{\"error\":\"Token invalide.\"}");
    });
  });
  
});
