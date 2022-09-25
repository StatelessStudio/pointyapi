/**
 * # Database
 *
 * TypeORM is mandatory, however you can plug in any database driver.
 * Postgres is used by defualt.
 *
 * ## Using Default Database
 *
 * Create a database and copy `.env.example` to `.env`.
 * Update the username, password, and database details.
 *
 * ## Setting Entities
 *
 * You will need to tell the database what entities to use. **You should do
 * this in your `pointy.before` function.**
 * ```typescript
 * import { pointy } from 'pointyapi';
 * import { ExampleUser } from 'pointyapi/models';
 *
 * // Database
 * pointy.before = async (app) => {
 * 		await pointy.db
 * 			.setEntities([ ExampleUser ])
 * 			.connect()
 * 			.catch((error) => pointy.error(error));
 * });
 * ```
 *
 * ## Creating Custom Database Drivers
 *
 * You can create a custom database driver class by extending the BaseDb class.
 * You will also need to set the pointyapi database. You must run
 * TypeORM's `createConnection` function in your `Database::connect()`
 *
 * ```typescript
 * pointy.db = new MyDatabase();
 * ```
 *
 */

/**
 * Database classes
 */
export { BaseDb } from './base-db';
export { PointyPostgres } from './postgres';
