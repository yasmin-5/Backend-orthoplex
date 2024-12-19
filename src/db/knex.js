const knex = require("knex");
const knexfile = require("../../knexfile");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    // const environment = process.env.NODE_ENV;
    const environment = "development";
    const config = knexfile[environment];

    this.connection = knex(config);
    Database.instance = this;
  }
  getConnection() {
    return this.connection;
  }
}

module.exports = new Database().getConnection();
