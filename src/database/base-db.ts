/**
 * Base Database class
 */

export class BaseDb {
	// Database logging function
	public logger: Function = (message, body?) => console.log(message, body);

	// Database error function
	public errorHandler: Function = (error) => console.error(error);

	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * Set ORM entities
	 * @param entities any[] Array of entities
	 */
	public setEntities(entities: any[]): BaseDb {
		return this;
	}

	// Create database connection
	public async connect(options: string | Object): Promise<any> {
		return new Promise((accept) => accept());
	}
}
