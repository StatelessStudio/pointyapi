import { pointy } from '../../../src';
import { basicCors, loadUser } from '../../../src/middleware';
import { ExampleUser } from '../../../src/models/example-user';
import { log } from '../../../src/log';

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
		.connect()
		.catch((error) => pointy.error(error));
};

// Listen
pointy.start()
	.then((...results) => log.debug('Guards Server complete', results))
	.catch((...errors) => log.error('Error', errors));

