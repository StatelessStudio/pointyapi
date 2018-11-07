import { Request, Response } from 'express';

export class BaseModel {
	public id?: any = undefined;
}

export interface BaseModelInterface {
	new (): BaseModel;
}
