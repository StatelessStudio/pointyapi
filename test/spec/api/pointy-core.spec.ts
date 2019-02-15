import { pointy } from '../../../src/pointy-core';
import { BaseUser } from '../../../src/models';
import { ExampleOwner } from '../../examples/api/models/example-owner';
import { ExampleRelation } from '../../examples/api/models/example-relation';

const ROOT_PATH = require('app-root-path').toString();

beforeAll(async () => {
	// Initialize pointy-core
	// Database
	await pointy.db
		.setEntities([ BaseUser, ExampleOwner, ExampleRelation ])
		.connect(ROOT_PATH)
		.catch((error) =>
			fail('Cannot start database' + JSON.stringify(error))
		);

	await pointy.start();

	process.env.PORT = '8081';
});

describe('Pointy Core', () => {
	beforeEach(() => {
		this.errorHandler = pointy.error;
	});

	afterEach(() => {
		pointy.error = this.errorHandler;
	});

	it('Handles Express error events', () => {
		let result = false;
		pointy.error = () => (result = true);

		pointy.app.emit('error', '');

		expect(result).toBe(true);
	});
});
