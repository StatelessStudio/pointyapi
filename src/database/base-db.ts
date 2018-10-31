export class BaseDb {
	constructor() {}

	public logger: Function = (message, body?) => console.log(message, body);
	public errorHandler: Function = (error) => console.error(error);

	public setEntities(entities: any[]): BaseDb {
		return this;
	}
	public async connect(options: string | Object): Promise<any> {
		return new Promise((accept) => accept());
	}
}
