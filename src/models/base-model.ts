import { Request, Response } from 'express';

export class BaseModel {
	public id?: number = undefined;

	public delete(request: Request, response: Response) {}

	public get(request: Request, response: Response) {}

	public post(request: Request, response: Response) {}

	public put(request: Request, response: Response) {}
}

export interface BaseModelInterface {
	new (): BaseModel;
}
