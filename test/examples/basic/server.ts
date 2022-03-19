import { pointy } from '../../../src';
import { basicCors, loadUser } from '../../../src/middleware';
import { ExampleUser } from '../../../src/models/example-user';
const ROOT_PATH = require('app-root-path').toString();

// Routes
import { userRouter } from './routes/user';

pointy.userType = ExampleUser;

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
		.setEntities([ ExampleUser ])
		.connect(ROOT_PATH)
		.catch((error) => pointy.error(error));
};

// Listen
pointy.start();
