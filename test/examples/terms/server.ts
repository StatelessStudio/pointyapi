import { pointy } from '../../../src';
import { basicCors, loadUser } from '../../../src/middleware';

const ROOT_PATH = require('app-root-path').toString();

// Models
import { User } from './models/user';
import { Term } from './models/term';

// Routes
import { userRouter } from './routes/user';
import { authRouter } from './routes/auth';
import { termRouter } from './routes/term';

pointy.userType = User;

// Setup
pointy.before = async (app) => {
	// Cors
	app.use(basicCors);

	// Load user
	app.use(loadUser);

	// Routes
	app.use('/api/v1/user', userRouter);
	app.use('/api/v1/auth', authRouter);
	app.use('/api/v1/term', termRouter);

	// Database
	await pointy.db
		.setEntities([ User, Term ])
		.connect(ROOT_PATH)
		.catch((error) => pointy.error(error));
};

// Listen
pointy.start()
	.then(() => console.log('Complete'))
	.catch(error => console.error('Error', error));
