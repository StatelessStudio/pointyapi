import * as PostgressConnectionStringParser from 'pg-connection-string';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import * as path from 'path';

import { BaseDb } from './base-db';

/**
 * Postgres Database Handler
 */
export class PointyPostgres extends BaseDb {
	/**
	 * Connect to the database
	 * @param options Database credentials (pass
	 * 	a string to load from file, or pass the object directly). Database
	 * 	will rely on `process.env.DATABASE_URL` if this is not set.
	 */
	public connect(options?: string | Object): Promise<Connection> {
		return new Promise(async (accept, reject) => {
			let pgOptions: any;

			if (process.env.DATABASE_URL) {
				// Live
				pgOptions = PostgressConnectionStringParser.parse(
					process.env.DATABASE_URL
				);
				pgOptions.type = 'postgres';

				this.logger('Using production database');
				this.logger(
					'Using database driver',
					process.env.TYPEORM_DRIVER_TYPE || pgOptions.type
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
					process.env.TYPEORM_DRIVER_TYPE || pgOptions.type
				);

				this.shouldSync = true;
			}

			// Create connection
			const conn = await createConnection(<ConnectionOptions>{
				name: this.connectionName,
				type: process.env.TYPEORM_DRIVER_TYPE || pgOptions.type,
				driver: process.env.TYPEORM_DRIVER_TYPE || pgOptions.type,
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
				ssl: {
					rejectUnauthorized: false
				}
			}).catch((error) => {
				reject(error);
				return false;
			});

			if (conn && conn instanceof Connection) {
				this.conn = conn;
				accept(this.conn);
			}
		});
	}
}
