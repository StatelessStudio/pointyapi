import { ConnectionOptions } from 'typeorm';
import { env } from './src/environment';

const options: ConnectionOptions = {
	type: env.POINTY_DB_TYPE,
	host: env.POINTY_DB_HOST,
	port: env.POINTY_DB_PORT,
	username: env.POINTY_DB_USER,
	password: env.POINTY_DB_PASS,
	database: env.POINTY_DB_NAME,
	entities: [],
	uuidExtension: 'pgcrypto'
};

module.exports = options;
