/**
 * Base Model
 */
export class BaseModel {
	public id?: any = undefined;

	constructor(id?) {
		this.id = id;
	}
}

export type BaseModelInterface = new () => BaseModel;
