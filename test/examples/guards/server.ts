import { bootstrap } from 'ts-async-bootstrap';
import { pointy } from '../../../src';
import { basicCors, loadUser } from '../../../src/middleware';
import { ExampleUser } from '../../../src/models/example-user';
const ROOT_PATH = require('app-root-path').toString();

// Routes
import { userRouter } from './routes/user';
import { authRouter } from './routes/auth';

pointy.userType = ExampleUser;

// Setup
pointy.before = async (app) => {
	// Cors
	app.use(basicCors);

	// Load user
	app.use(loadUser);

	// Routes
	app.use('/api/v1/user', userRouter);
	app.use('/api/v1/auth', authRouter);

	// Database
	await pointy.db
		.setEntities([ ExampleUser ])
		.connect(ROOT_PATH)
		.catch((error) => pointy.error(error));
};

// Listen
bootstrap({ run: async () => {
	await pointy.start();
} });
