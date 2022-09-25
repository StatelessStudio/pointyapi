import { pointy } from '../../../src';
import { basicCors, loadUser } from '../../../src/middleware';
import { log } from '../../../src/log';

// Routes
import { userRouter } from './routes/user';
import { authRouter } from './routes/auth';
import { chatRouter } from './routes/chat';
import { ChatMessage } from './models/chat-message';
import { User } from './models/user';

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
	app.use('/api/v1/chat', chatRouter);

	// Database
	await pointy.db
		.setEntities([ User, ChatMessage ])
		.connect()
		.catch((error) => pointy.error(error));
};

// Listen
pointy.start()
	.then((...results) => log.debug('Chat Server complete', results))
	.catch((...errors) => log.error('Error', errors));
