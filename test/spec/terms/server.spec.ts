import 'jasmine';

import { pointy } from '../../../src/';
import { forkServer } from '../../../src/utils/fork-server';
import { User } from '../../examples/terms/models/user';
import { Term } from '../../examples/terms/models/term';

const http = pointy.http;

let serverfork;

beforeAll(async () => {
	serverfork = await forkServer('./dist/test/examples/terms/server.js');

	// Database
	await pointy.db
		.setEntities([ Term, User ])
		.connect()
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
