const { MongoClient } = require('mongodb');
const config = require('config');
const logger = require('../utils/logger');

const {host, port} = config.get('dbConfig');
const uri = `mongodb://${host}:${port}/`;
const client = new MongoClient(uri);

let dbConnection;

module.exports = {
  connectToServer: async () => {
    try {
      await client.connect();
      dbConnection = client.db('todoList');
      logger.info('Database connected!');
    } catch (error) {
      logger.error(`Could not connect to database, message: ${err}`);
      process.exit(1);
    }
  },
  getDb: () => {
    return dbConnection;
  }
};