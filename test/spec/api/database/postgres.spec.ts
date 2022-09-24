import 'jasmine';
import { PointyPostgres } from '../../../../src/database';
import { ExampleUser } from '../../../../src/models';
import * as path from 'path';
const ROOT_PATH = require('app-root-path').toString();

/**
 * PointyPostgres
 * pointyapi/database
 */
describe('[Database: Postgres]', async () => {
	let db;
	let clog;

	beforeAll(() => {
		db = new PointyPostgres();
		db.connectionName = 'testconn';
		db.errorHandler = (error) => fail(error);
		db.logger = () => {};
	});

	beforeEach(() => {
		clog = console.log;
	});

	afterEach(() => {
		console.log = clog;
	});

	it('can set entities', () => {
		db.setEntities([ ExampleUser ]);
	});

	it('can connect', async () => {
		// Database
		await db.connect(ROOT_PATH).catch((error) => fail(error));
	});

	it('can connect with json options', async () => {
		const db = new PointyPostgres();
		db.connectionName = 'jsonconn';
		db.logger = () => {};

		// Database
		const options: Object = Object.assign(
			{},
			require(path.join(ROOT_PATH, 'local.config.json'))
		);

		await db.connect(options).catch((error) => fail(error));
	});
});
