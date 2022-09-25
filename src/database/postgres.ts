import * as PgConnString from 'pg-connection-string';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { env as _environmentVars, DatabaseConfig } from '../environment';

import { BaseDb } from './base-db';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

/**
 * Postgres Database Handler
 */
export class PointyPostgres extends BaseDb {
	public async connect(env?: DatabaseConfig): Promise<Connection> {
		let pgOptions: PostgresConnectionOptions = {
			type: 'postgres',
		};

		if (!env) {
			env = _environmentVars;
		}

		this.logger('Using database driver: postgres');

		if (env.DATABASE_URL) {
			this.logger('Using connection from DATABASE_URL');

			const connstr = PgConnString.parse(env.DATABASE_URL);

			pgOptions = {
				...pgOptions,
				host: connstr.host,
				port: parseInt(connstr.port, 10),
				database: connstr.database,
				ssl: !!connstr.ssl,
				username: connstr.user,
				password: connstr.password,
			};
		}
		else {
			this.logger('Using connection from env');

			pgOptions = {
				...pgOptions,
				host: env.POINTY_DB_HOST,
				port: env.POINTY_DB_PORT,
				database: env.POINTY_DB_NAME,
				ssl: !!env.POINTY_DB_SSL,
				username: env.POINTY_DB_USER,
				password: env.POINTY_DB_PASS,
			};

			this.shouldSync = true;
		}

		const options: ConnectionOptions = {
			name: this.connectionName,
			type: 'postgres',
			host: pgOptions.host,
			port: pgOptions.port,
			username: pgOptions.username,
			password: pgOptions.password,
			database: pgOptions.database,
			entities: this.entities,
			synchronize: this.shouldSync,
			ssl: pgOptions.ssl ?
				{ rejectUnauthorized: false } :
				undefined,
			uuidExtension: pgOptions.uuidExtension
				? pgOptions.uuidExtension
				: 'pgcrypto'
		};

		// Create connection
		const conn = await createConnection(options);

		if (conn && conn instanceof Connection) {
			this.conn = conn;
			return this.conn;
		}
		else {
			throw new Error('Could not create connection');
		}
	}
}
9;