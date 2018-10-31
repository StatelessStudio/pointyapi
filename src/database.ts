/**
 * # Database
 *
 * TypeORM is mandatory, however you can plug in any database driver.
 * Postgres is used by defualt.
 *
 * ## Using Default Database
 *
 * Create a database and copy `local.config.sample.json` to `local.config.json`.
 * Update the username, password, and database details.
 *
 * ## Setting Entities
 *
 * You will need to tell the database what entities to use.  **You should do
 * this in your `pointy.before` function.**
 * ```typescript
 * import { pointy } from 'pointyapi';
 * import { BaseUser } from 'pointyapi/models';
 * const ROOT_PATH = require('app-root-path');
 *
 * // Database
 * pointy.before = async (app) => {
 * 		await pointy.db
 * 			.setEntities([ BaseUser ])
 * 			.connect(ROOT_PATH)
 * 			.catch((error) => pointy.error(error));
 * });
 * ```
 *
 * ## Creating Custom Database Drivers
 *
 * You can create a custom database driver class by extending the BaseDb class.
 * You will also need to set the pointyapi database.  You must run
 * TypeORM's `createConnection` function in your `Database::connect()`
 *
 * ```typescript
 * pointy.db = new MyDatabase();
 * ```
 *
 * Example database class:
 * ```typescript
 * import { createConnection, ConnectionOptions } from 'typeorm';
 * import { BaseDb } from 'pointyapi/database';
 *
 * export class MyDatabase extends BaseDb {
 * 	public shouldSync = false;
 * 	public entities: any[];
 *
 * 	constructor() {
 * 		super();
 *
 * 		this.entities = [ BaseUser ];
 * 	}
 *
 * 	public setEntities(entities: any[]) {
 * 		this.entities = entities;
 *
 * 		return this;
 * 	}
 *
 * 	public async connect(rootPath: string) {
 * 		await createConnection(<ConnectionOptions>{
 * 			name: 'default',
 * 			type: process.env.TYPEORM_DRIVER_TYPE,
 * 			driver: process.env.TYPEORM_DRIVER_TYPE,
 * 			host: process.env.db_host,
 * 			port: process.env.db_port,
 * 			username: process.env.db_username,
 * 			password: process.env.db_password,
 * 			database: process.env.db_database,
 * 			entities: this.entities,
 * 			synchronize: this.shouldSync
 * 		}).catch((error) => this.errorHandler(error));
 * 	}
 * }
 * ```
 */

/**
 * Database classes
 */
export { BaseDb } from './database/base-db';
export { PointyPostgres } from './database/postgres';
