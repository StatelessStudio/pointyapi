import { pointy } from '../../../src/pointy-core';

const ROOT_PATH = require('app-root-path').toString();

beforeAll(async () => {
	// Initialize pointy-core
	// Database
	await pointy.db
		.connect(ROOT_PATH)
		.catch((error) =>
			fail('Cannot start database' + JSON.stringify(error))
		);
});
