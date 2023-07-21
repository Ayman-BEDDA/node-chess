const genericController = require("./generic");

module.exports = function FriendController(Service, options = {}) {
  const GenericController = genericController(Service, options);

  return {
    ...GenericController,
    send: async (req, res) => {
        const { id, id_receiver } = req.params;

        const userExists = await UserService.findOne({ id: parseInt(id, 10) });
        const receiverExists = await UserService.findOne({ id: parseInt(id_receiver, 10) });

        if (!userExists || !receiverExists) {
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
            res.status(201).json(result);
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
        if (result) res.json(result);
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
        if (result) res.json(result);
        else res.sendStatus(404);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    friends_list: async (req, res) => {
        const { id } = req.params;
        try {
            const friends = await Service.findAll({ id_user: parseInt(id, 10), status: 'accepted' });
            res.json(friends);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    pending: async (req, res) => {
        const { id } = req.params;
        try {
            console.log(parseInt(id, 10))
            const pending = await Service.findAll({ id_user_receiver: parseInt(id, 10), status: 'waiting' });
            res.json(pending);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    delete: async (req, res) => {
      const { id, id_receiver } = req.params;
      try {
        const result = await Service.delete({ id_user: id, id_user_receiver: id_receiver });

        if (result) res.status(200).json({ message: "Friendship deleted successfully" });
        else{ 
          const result = await Service.delete({ id_user: id_receiver, id_user_receiver: id });
          if (result) res.status(200).json({ message: "Friendship deleted successfully" });
          else res.status(404).json({ message: "Friendship not found" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  };
};
