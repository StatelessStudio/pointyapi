import 'jasmine';

import { pointy } from '../../../src/';
import { forkServer } from '../../../src/fork-server';
import { User } from '../../examples/chat/models/user';
import { ChatMessage } from '../../examples/chat/models/chat-message';
const ROOT_PATH = require('app-root-path').toString();

const http = pointy.http;

let serverfork;

beforeAll(async () => {
	serverfork = await forkServer('./lib/test/examples/chat/server.js');

	// Database
	await pointy.db
		.setEntities([ ChatMessage, User ])
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
			.get('/', {}, [ 200, 404 ])
			.catch((error) => fail(JSON.stringify(error)));
	});
});