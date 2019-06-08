import { Connection } from 'typeorm';
import { ExampleUser } from '../models/example-user';

/**
 * Base Database class
 */
export class BaseDb {
	// Database logging function
	public logger: Function = (message, body?) => console.log(message, body);

	// Database error function
	public errorHandler: Function = (error) => console.error(error);

	// Database entities
	public entities: any[] = [ ExampleUser ];

	// Connection name.  Default is "default"
	public connectionName = 'default';

	// Auto-sync (Empties database on restart, not for production!)
	public shouldSync = false;

	// Connection
	public conn: Connection;

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

	// Create database connection
	public async connect(options: string | Object): Promise<any> {
		return new Promise((accept) => accept());
	}
}
