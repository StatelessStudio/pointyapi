import { PointyPostgres } from '../../../../src/database';
import { ExampleUser } from '../../../../src/models';
import * as path from 'path';
const ROOT_PATH = require('app-root-path').toString();

/**
 * PointyPostgres
 * pointyapi/database
 */
describe('[Database: Postgres]', async () => {
	beforeAll(() => {
		this.db = new PointyPostgres();
		this.db.connectionName = 'testconn';
		this.db.errorHandler = (error) => fail(error);
		this.db.logger = () => {};
	});

	beforeEach(() => {
		this.clog = console.log;
	});

	afterEach(() => {
		console.log = this.clog;
	});

	it('can set entities', () => {
		this.db.setEntities([ ExampleUser ]);
	});

	it('can connect', async () => {
		// Database
		await this.db.connect(ROOT_PATH).catch((error) => fail(error));
	});

	it('can connect with json options', async () => {
		const db = new PointyPostgres();
		db.connectionName = 'jsonconn';
		db.errorHandler = (error) => fail(error);
		db.logger = () => {};

		// Database
		const options: Object = Object.assign(
			{},
			require(path.join(ROOT_PATH, 'local.config.json'))
		);

		await db.connect(options).catch((error) => fail(error));
	});
});
