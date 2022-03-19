const dbSettings = require('./local.config.json');

module.exports = {
	type: dbSettings.type,
	host: dbSettings.host,
	port: dbSettings.port,
	user: dbSettings.user,
	password: dbSettings.password,
	database: dbSettings.database,
	entities: [],
	uuidExtension: 'pgcrypto'
};
