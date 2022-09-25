import 'jasmine';
import { PointyPostgres } from '../../../../src/database';
import { ExampleUser } from '../../../../src/models';
import { env } from '../../../../src/environment';

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
		await db.connect().catch((error) => fail(error));
	});

	it('can connect with json options', async () => {
		const db = new PointyPostgres();
		db.connectionName = 'jsonconn';
		db.logger = () => {};

		// Database
		const options: any = Object.assign(
			{},
			env
		);

		await db.connect(options).catch((error) => fail(error));
	});
});
