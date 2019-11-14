import 'jasmine';

import { pointy } from '../../../src/';
import { forkServer } from '../../../src/utils/fork-server';
import { ExampleUser } from '../../../src/models';
const ROOT_PATH = require('app-root-path').toString();

const http = pointy.http;

let serverfork;

beforeAll(async () => {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

	serverfork = await forkServer('./lib/test/examples/guards/server.js');

	// Database
	await pointy.db
		.setEntities([ ExampleUser ])
		.connect(ROOT_PATH)
		.catch((error) =>
			fail('Cannot start database' + JSON.stringify(error))
		);
});

afterAll(() => {
	if (serverfork) {
		serverfork.kill();
	}
});

describe('API Server', () => {
	it('is running', async () => {
		await http
			.get('/', {}, undefined, [ 200, 404 ])
			.catch((error) => fail(JSON.stringify(error)));
	});
});
