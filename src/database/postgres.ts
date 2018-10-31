import * as PostgressConnectionStringParser from 'pg-connection-string';
import { createConnection, ConnectionOptions } from 'typeorm';
import * as path from 'path';

import { BaseUser } from '../models/base-user';
import { BaseDb } from './base-db';

export class PointyPostgres extends BaseDb {
	public shouldSync = false;
	public entities: any[];

	constructor() {
		super();

		this.entities = [ BaseUser ];
	}

	public setEntities(entities: any[]) {
		this.entities = entities;

		return this;
	}

	public async connect(options: string | Object) {
		let pgOptions: any;

		if (process.env.DATABASE_URL) {
			// Live
			pgOptions = PostgressConnectionStringParser.parse(
				process.env.DATABASE_URL
			);
			pgOptions.type = 'postgres';

			this.logger('Using production database', pgOptions);
			this.logger(
				'Using database driver',
				process.env.TYPEORM_DRIVER_TYPE || pgOptions.type
			);
		}
		else {
			// Local
			if (typeof options === 'string' || options instanceof String) {
				pgOptions = require(path.join(
					options.toString(),
					'local.config.json'
				));
			}
			else {
				pgOptions = options;
			}

			this.logger('Using development database', pgOptions);
			this.logger(
				'Using database driver',
				process.env.TYPEORM_DRIVER_TYPE || pgOptions.type
			);

			this.shouldSync = true;
		}

		await createConnection(<ConnectionOptions>{
			name: 'default',
			type: process.env.TYPEORM_DRIVER_TYPE || pgOptions.type,
			driver: process.env.TYPEORM_DRIVER_TYPE || pgOptions.type,
			host: pgOptions.host,
			port: pgOptions.port,
			username: pgOptions.user,
			password: pgOptions.password,
			database: pgOptions.database,
			entities: this.entities,
			synchronize: this.shouldSync
		}).catch((error) => this.errorHandler(error));
	}
}
