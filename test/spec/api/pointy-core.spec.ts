import 'jasmine';
import { pointy } from '../../../src/pointy-core';
import { ExampleUser } from '../../../src/models';
import { ExampleOwner } from '../../examples/api/models/example-owner';
import { ExampleRelation } from '../../examples/api/models/example-relation';
import { HookTestClass } from '../../examples/api/models/hook-test-class';

const ROOT_PATH = require('app-root-path').toString();

let ipcMessage;
let errorHandler;

beforeAll(async () => {
	// Initialize pointy-core
	pointy.userType = ExampleUser;

	// Database
	pointy.before = async () => {
		await pointy.db
			.setEntities([
				ExampleUser,
				ExampleOwner,
				ExampleRelation,
				HookTestClass
			])
			.connect(ROOT_PATH)
			.catch((error) =>
				fail('Cannot start database' + JSON.stringify(error))
			);
	};

	// Intercept IPC messages
	const _send = process.send;
	process.send = (message) => (ipcMessage = message);

	// Start server
	await pointy.start();

	// Release IPC message interceptor
	process.send = _send;

	jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
	process.env.PORT = '8081';
});

describe('Pointy Core', () => {
	beforeEach(() => {
		errorHandler = pointy.error;
	});

	afterEach(() => {
		pointy.error = errorHandler;
	});

	it('Handles Express error events', () => {
		let result = false;
		pointy.error = () => (result = true);

		pointy.app.emit('error', '');

		expect(result).toBe(true);
	});

	it('sends an ipc message "server-ready"', async () => {
		expect(ipcMessage).toBe('server-ready');
	});
});
