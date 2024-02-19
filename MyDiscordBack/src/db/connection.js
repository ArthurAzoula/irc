const { Sequelize } = require('sequelize');
const config = require('./config/config.json');
const Logger = require('../helper/Logger.helper');

const env = process.env;
const environment = env.NODE_ENV || 'development';

const dbConfig = config[environment];

const sequelize = new Sequelize(
  env.DATABASE_NAME || dbConfig.database,
  env.DATABASE_USERNAME || dbConfig.username,
  env.DATABASE_PASSWORD || dbConfig.password,
  {
    host: env.DATABASE_HOST || dbConfig.host,
    dialect: env.DATABASE_DIALECT || dbConfig.dialect,
    port: env.DATABASE_PORT || dbConfig.port,
    logging: false
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
