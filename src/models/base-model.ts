import { Request, Response } from 'express';

export class BaseModel {
	public id?: any = undefined;

	constructor(id?) {
		this.id = id;
	}
}

export interface BaseModelInterface {
	new (): BaseModel;
}
