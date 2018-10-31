import { Response } from 'express';

export type ResponderFunction = (result: any, response: Response) => void;
export type ErrorHandlerFunction = (
	error: any,
	response?: Response,
	code?: number
) => void;
export type LogHandlerFunction = (message: string, data?: any) => void;
