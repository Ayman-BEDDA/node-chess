const genericController = require("./generic");
const UserService = require("../services/user");
const { v4: uuidv4 } = require("uuid");
const { isUUID } = require("validator");

module.exports = function FriendController(Service, options = {}) {
  const GenericController = genericController(Service, options);

  return {
    ...GenericController,
    send: async (req, res) => {
        const { id, id_receiver } = req.params;

        if (!isUUID(id) || !isUUID(id_receiver)) {
          return res.status(404).json({ message: "User not found" });
        }

        const friendshipExists = await Service.findOne({ id_user: id, id_user_receiver: id_receiver });

        if (friendshipExists) {
            return res.status(409).json({ message: "Friendship already exists" });
        }

        const reverseFriendshipExists = await Service.findOne({ id_user: id_receiver, id_user_receiver: id });

        if (reverseFriendshipExists) {
            if (reverseFriendshipExists.status === 'waiting') {
                const result = await Service.update(
                    { id_user: id_receiver, id_user_receiver: id },
                    { status: 'accepted' }
                );
                return res.status(200).json(result);
            } else if (reverseFriendshipExists.status === 'accepted') {
                return res.status(409).json({ message: "Friendship already exists" });
            }
        }

        try {
            const result = await Service.create({
            id_user: id,
            id_user_receiver: id_receiver,
            status: 'waiting',
            date: new Date(),
            });

            const result2 = await Service.create({
              id_user: id_receiver,
              id_user_receiver: id,
              status: 'waiting',
              date: new Date(),
            });
            
            res.status(201).json({ result, result2 });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deny: async (req, res) => {
      const { id, id_receiver } = req.params;
      try {
        const result = await Service.update(
          { id_user: id, id_user_receiver: id_receiver },
          { status: 'denied' }
        );

        const result2 = await Service.update(
          { id_user: id, id_user_receiver: id_receiver },
          { status: 'denied' }
        );
        if (result && result2) res.json({result, result2});
        else res.sendStatus(404);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    accept: async (req, res) => {
      const { id, id_receiver } = req.params;
      try {
        const result = await Service.update(
          { id_user: id, id_user_receiver: id_receiver },
          { status: 'accepted' }
        );
        const result2 = await Service.update(
          { id_user: id_receiver, id_user_receiver: id },
          { status: 'accepted' }
        );
        if (result && result2) res.json({result, result2});
        else res.sendStatus(404);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    friends_list: async (req, res) => {
        const { id } = req.params;
        try {
          if (!isUUID(id)) {
            return res.status(404);
          }
            const friends = await Service.findAll({ id_user: id, status: 'accepted' });
            res.json(friends);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    pending: async (req, res) => {
        const { id } = req.params;
        try {
            if (!isUUID(id)) {
              return res.status(404);
            }
            const pending = await Service.findAll({ id_user_receiver: id, status: 'waiting' });
            res.json(pending);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    delete: async (req, res) => {
      const { id, id_receiver } = req.params;
      try {
        if (!isUUID(id) || !isUUID(id_receiver)) {
          return res.status(404);
        }
        const result = await Service.delete({ id_user: id, id_user_receiver: id_receiver });
        const result2 = await Service.delete({ id_user: id_receiver, id_user_receiver: id });

        if (result && result2) {
          res.status(200).json({ message: "Friendship deleted successfully" });
        } else{ 
          res.status(404).json({ message: "Friendship not found" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  };
};
