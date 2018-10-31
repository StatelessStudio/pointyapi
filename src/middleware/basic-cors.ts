import { Request, Response, NextFunction } from 'express';

export function basicCors(
	request: Request,
	response: Response,
	next: NextFunction
) {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader(
		'Access-Control-Allow-Methods',
		'POST, GET, PUT, DELETE'
	);
	response.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With, Content-Type, Authorization'
	);
	response.setHeader('Access-Control-Allow-Credentials', 'true');

	next();
}
