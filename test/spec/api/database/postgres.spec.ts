import { PointyPostgres } from '../../../../src/database';
import { BaseUser } from '../../../../src/models';
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

	it('can set entities', () => {
		this.db.setEntities([ BaseUser ]);
	});

	it('can connect', async () => {
		// Database
		await this.db.connect(ROOT_PATH).catch((error) => fail(error));
	});
});
