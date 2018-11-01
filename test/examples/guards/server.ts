import { pointy } from '../../../src';
import { basicCors, loadUser } from '../../../src/middleware';
import { BaseUser } from '../../../src/models/base-user';
const ROOT_PATH = require('app-root-path').toString();

// Routes
import { userRouter } from './routes/user';

// Setup
pointy.before = async (app) => {
	// Cors
	app.use(basicCors);

	// Load user
	app.use(loadUser);

	// Routes
	app.use('/api/v1/user', userRouter);

	// Database
	await pointy.db
		.setEntities([ BaseUser ])
		.connect(ROOT_PATH)
		.catch((error) => pointy.error(error));
};

// Listen
pointy.start();
