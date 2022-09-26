import { bootstrap } from '../../../src/bootstrap';
import { pointy } from '../../../src';
import { basicCors, loadUser } from '../../../src/middleware';
import { log } from '../../../src/log';

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
		.connect()
		.catch((error) => pointy.error(error));
};

// Listen
bootstrap(async () => await pointy.start());
