import { Request, Response } from 'express';

export class BaseModel {
	public id?: number = undefined;
}

export interface BaseModelInterface {
	new (): BaseModel;
}
