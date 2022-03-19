import * as PostgressConnectionStringParser from 'pg-connection-string';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import * as path from 'path';

import { BaseDb } from './base-db';
import { env } from '../environment';

/**
 * Postgres Database Handler
 */
export class PointyPostgres extends BaseDb {
	/**
	 * Connect to the database
	 * @param options Database credentials (pass
	 * 	a string to load from file, or pass the object directly). Database
	 * 	will rely on `env.DATABASE_URL` if this is not set.
	 */
	public async connect(options?: string | Object): Promise<Connection> {
		let pgOptions: any;
		let useSSL = false;

		if (env.DATABASE_URL) {
			// Live
			pgOptions = PostgressConnectionStringParser.parse(
				env.DATABASE_URL
			);
			pgOptions.type = 'postgres';
			useSSL = true;

			this.logger('Using production database');
			this.logger(
				'Using database driver',
				pgOptions.type
			);
		}
		else {
			// Local
			if (typeof options === 'string') {
				pgOptions = require(path.join(
					options.toString(),
					'local.config.json'
				));
			}
			else {
				pgOptions = options;
			}

			this.logger('Using development database');
			this.logger(
				'Using database driver',
				pgOptions.type
			);

			this.shouldSync = true;
		}

		const connectionOptions: ConnectionOptions = {
			name: this.connectionName,
			type: pgOptions.type,
			host: pgOptions.host,
			port: pgOptions.port,
			username: pgOptions.user,
			password: pgOptions.password,
			database: pgOptions.database,
			entities: this.entities,
			synchronize: this.shouldSync,
			uuidExtension: pgOptions.uuidExtension
				? pgOptions.uuidExtension
				: 'pgcrypto',
			ssl: useSSL ? { rejectUnauthorized: false } : undefined
		};

		// Create connection
		this.conn = await createConnection(connectionOptions);

		return this.conn;
	}
}
