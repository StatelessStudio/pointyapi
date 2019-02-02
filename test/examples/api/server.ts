import { pointy } from '../../../src';
import { basicCors, loadUser } from '../../../src/middleware';
import { BaseUser } from '../../../src/models/base-user';
const ROOT_PATH = require('app-root-path').toString();

// Setup
pointy.before = async (app) => {
	// Cors
	app.use(basicCors);

	// Load user
	app.use(loadUser);

	// Database
	await pointy.db
		.setEntities([ BaseUser ])
		.connect(ROOT_PATH)
		.catch((error) => pointy.error(error));
};

// Listen
pointy.start();
