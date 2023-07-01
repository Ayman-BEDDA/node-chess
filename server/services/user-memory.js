let users = [];

module.exports = function UserService() {
  return {
    findAll: async function (filters, options) {
      let filteredUsers = users.filter((user) =>
        Object.entries(filters).every(([key, value]) => user[key] === value)
      );
      // options.order = {name: "ASC", dob: "DESC"}
      if (options.order) {
        filteredUsers = filteredUsers.sort((a, b) =>
          compare(a, b, options.order)
        );
      }
      if (options.limit) {
        filteredUsers = filteredUsers.slice(
          options.offset,
          options.offset + options.limit
        );
      }
      return filteredUsers;
    },
    findOne: async function (filters) {
      return users.find((user) =>
        Object.entries(filters).every(([key, value]) => user[key] === value)
      );
    },
    create: async function (data) {
      const user = { id: Date.now(), ...data };
      if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        const error = new Error();
        error.name = "ValidationError";
        error.errors = {
          email: "Email is not valid",
        };
        throw error;
      }
      users.push(user);
      return user;
    },
    replace: async (filters, newData) => {
      const userIndex = users.findIndex((user) =>
        Object.entries(filters).every(([key, value]) => user[key] === value)
      );
      if (userIndex === -1) {
        users.push(newData);
        return [[newData, true]];
      } else {
        users.splice(userIndex, 1, newData);
        return [[newData, false]];
      }
    },
    update: async (filters, newData) => {
      const user = users.find((user) =>
        Object.entries(filters).every(([key, value]) => user[key] === value)
      );
      if (!user) return [];
      Object.assign(user, newData);
      return [user];
    },
    delete: async (filters) => {
      let nbDeleted = 0;
      users = users.filter((user) => {
        if (
          Object.entries(filters).every(([key, value]) => user[key] === value)
        ) {
          nbDeleted++;
          return false;
        } else {
          return true;
        }
      });
      return nbDeleted;
    },
  };
};

function compare(a, b, order, index = 0) {
  const [key, direction] = Object.entries(order)[index];
  if (direction === "ASC") {
    if (a[key] === b[key]) {
      return compare(a, b, order, index + 1);
    }
    return a[key] > b[key] ? 1 : -1;
  }
  if (direction === "DESC") {
    if (a[key] === b[key]) {
      return compare(a, b, order, index + 1);
    }
    return a[key] < b[key] ? 1 : -1;
  }
}
