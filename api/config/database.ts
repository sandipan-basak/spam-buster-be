import { Sequelize, type Dialect } from 'sequelize';
import AllConfig from './config';

function throwConfigError (field: string): never {
  throw new Error(`${field} is not defined.`);
}

type Environment = 'development' | 'test' | 'production';

// Use a function to determine the environment, checking explicitly for undefined and empty strings
function getEnvironment (defaultEnv: Environment): Environment {
  const env = process.env.NODE_ENV;
  if (env == null || env.trim() === '') {
    return defaultEnv;
  }
  return env as Environment;
}

const env: Environment = getEnvironment('development');
const config = AllConfig[env];

const username = config.username ?? throwConfigError('DB_USERNAME');
const password = config.password ?? throwConfigError('DB_PASSWORD');
const database = config.database ?? throwConfigError('DB_NAME');
const host = config.host ?? throwConfigError('DB_HOST');

export const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: config.dialect as Dialect,
  logging: config.logging
});
