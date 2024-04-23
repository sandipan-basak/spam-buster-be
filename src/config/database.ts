import { Sequelize, type Dialect } from 'sequelize';
import AllConfig from './config';

const config = AllConfig.development;

export const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect as Dialect
});
