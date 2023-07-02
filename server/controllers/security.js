const jwt = require("jsonwebtoken");

module.exports = function SecurityController(UserService) {
  return {
    login: async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const user = await UserService.login(email, password);
        const token = jwt.sign(
          { id: user.id, login: user.login },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.json({ token });
      } catch (err) {
        next(err);
      }
    },
  };
};
