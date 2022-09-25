import { pointy } from '../../../src';
import { basicCors, loadUser } from '../../../src/middleware';
import { ExampleUser } from '../../../src/models/example-user';

pointy.userType = ExampleUser;

// Setup
pointy.before = async (app) => {
	// Cors
	app.use(basicCors);

	// Load user
	app.use(loadUser);

	// Database
	await pointy.db
		.setEntities([ ExampleUser ])
		.connect()
		.catch((error) => pointy.error(error));
};

// Listen
pointy.start()
	.then((...results) => console.log('Complete', results))
	.catch((...errors) => console.error('Error', errors));
