import { Connection } from 'typeorm';
import { DatabaseConfig } from '../environment';
import { ExampleUser } from '../models/example-user';

/**
 * Base Database class
 */
export class BaseDb {
	// Database entities
	public entities: any[] = [ ExampleUser ];

	// Connection name. Default is "default"
	public connectionName = 'default';

	// Auto-sync (Empties database on restart, not for production!)
	public shouldSync = false;

	// Connection
	public conn: Connection;

	// Database logging function
	public logger: Function = (message, body?) => console.log(message, body);

	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * Set ORM entities
	 * @param entities Array of entities
	 */
	public setEntities(entities: any[]) {
		this.entities = entities;

		return this;
	}

	/**
	 * Connect to the database
	 *
	 * @param env Database environment configuration
	 * @return Returns the connection
	 */
	public async connect(env?: DatabaseConfig): Promise<Connection> {
		return new Promise((accept) => accept(null));
	}
}
