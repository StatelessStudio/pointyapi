import 'jasmine';
import { PointyPostgres } from '../../../../src/database';
import { ExampleUser } from '../../../../src/models';
import { DatabaseConfig, env } from '../../../../src/environment';
import { Connection } from 'typeorm';

/**
 * PointyPostgres
 * pointyapi/database
 */
describe('[Database: Postgres]', async () => {
	const newDb: (string) => PointyPostgres = (name) => {
		const db = new PointyPostgres();
		db.connectionName = 'testconn_' + name;

		return db;
	};

	it('can set entities', () => {
		const db = newDb('setEntities');
		db.setEntities([ ExampleUser ]);

		expect(db.entities).toContain(ExampleUser);
	});

	it('can connect', async () => {
		// Database
		const conn = await newDb('connect').connect()
			.catch((error) => fail(error));

		conn ? await conn.close() : null;
	});

	it('can connect with json options', async () => {
		// Database
		const options: any = Object.assign(
			{},
			env
		);

		const conn = await newDb('jsonConn').connect(options)
			.catch((error) => fail(error));

		conn ? await conn.close() : null;
	});
});
