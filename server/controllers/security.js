const jwt = require("jsonwebtoken");

module.exports = function SecurityController(UserService) {
  return {
    login: async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const user = await UserService.login(email, password);
        const token = jwt.sign(
          { id: user.id, login: user.login, id_role: user.id_role },
          process.env.JWT_SECRET,
          {
            expiresIn: "5h",
          }
        );
        res.json({ token });
      } catch (err) {
        next(err);
      }
    },
    logout: async (req, res, next) => {
      try {
        res.clearCookie("token");
        res.sendStatus(200);
      } catch (err) {
        next(err);
      }
    },
  };
};
