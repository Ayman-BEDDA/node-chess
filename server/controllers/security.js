const jwt = require("jsonwebtoken");
//email
const { sendVerificationEmail, sendForgotPasswordEmail } = require("../mailers/mailer");

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
            expiresIn: "1h",
          }
        );
        res.json({ token });
      } catch (err) {
        next(err);
      }
    },
    logout: async (res, next) => {
      try {
        res.clearCookie("token");
        res.sendStatus(200);
      } catch (err) {
        next(err);
      }
    },
    register: async (req, res, next) => {
      try {
        const { login, email, password } = req.body;

        const oldUser = await UserService.findOne({ email });
        if (oldUser) {
          return res.status(409).send("Un utilisateur avec cet email existe déjà.");
        }

        const user = await UserService.create({
          login,
          email,
          password,
        });

        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "2h",
          }
        );

        user.token = token;
        await user.save();

        sendVerificationEmail(email, token);

        res.status(201).send("Votre compte a été créé avec succès. Veuillez vérifier votre boîte de réception pour activer votre compte.");
      }
      catch (err) {
        next(err);
      }
    },
    verify: async (req, res, next) => {
      try {
        const { token } = req.params;
    
        // Vérifier si le token est valide
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          return res.status(400).send("Token invalide.");
        }
    
        // Vérifier si l'utilisateur existe
        const user = await UserService.findOne({ email: decoded.email });
        if (!user) {
          return res.status(404).send("Utilisateur non trouvé.");
        }
    
        // Vérifier si le compte a déjà été vérifié
        if (user.isValid) {
          return res.status(400).send("Votre compte a déjà été vérifié.");
        }
    
        // Marquer le compte comme vérifié et supprimer le token
        user.isValid = true;
        user.token = null;
        await user.save();
    
        return res.status(200).send("Votre compte a été vérifié avec succès!");
      } catch (err) {
        next(err);
      }
    },    
    forgotPassword: async (req, res, next) => {
      try {
        const { email } = req.body;

        const user = await UserService.findOne({ email });
        if (!user) {
          return res.status(404).send("Utilisateur non trouvé.");
        }

        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "2h",
          }
        );

        user.token = token;
        await user.save();

        sendForgotPasswordEmail(email, token);

        return res.status(200).send("Veuillez vérifier votre boîte de réception pour réinitialiser votre mot de passe.");
      } catch (err) {
        next(err);
      }
    },
    resetPassword: async (req, res, next) => {
      try {
        const { token } = req.params;
        const { password } = req.body;
    
        // Vérifier si le token est valide
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          return res.status(400).send("Token invalide.");
        }
    
        // Vérifier si l'utilisateur existe
        const user = await UserService.findOne({ token: token });
        if (!user) {
          return res.status(404).send("Utilisateur non trouvé.");
        }
    
        // Réinitialiser le mot de passe et supprimer le token
        user.password = password;
        user.token = null;
        await user.save();
    
        return res.status(200).send("Votre mot de passe a été réinitialisé avec succès!");
      } catch (err) {
        next(err);
      }
    }    
  };
};
