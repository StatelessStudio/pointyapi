import { pointy } from '../../../src';
import { basicCors, loadUser } from '../../../src/middleware';
import { BaseUser } from '../../../src/models/base-user';
const ROOT_PATH = require('app-root-path').toString();

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
		.connect(ROOT_PATH)
		.catch((error) => pointy.error(error));
};

// Listen
pointy.start();
