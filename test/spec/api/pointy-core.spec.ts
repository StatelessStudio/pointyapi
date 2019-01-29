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
});
