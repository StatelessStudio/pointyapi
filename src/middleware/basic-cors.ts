import { Request, Response, NextFunction } from 'express';

/**
 * Basic CORS Middleware
 *
 * 	Access-Control-Allow-Origin
 * 		'*'
 * 	Access-Control-Allow-Methods
 * 		'POST, GET, PUT, DELETE'
 * 	Access-Control-Allow-Headers
 * 		'X-Requested-With, Content-Type, Authorization'
 * 	Access-Control-Allow-Credentials
 * 		'true'
 *
 */
export function basicCors(
	request: Request,
	response: Response,
	next: NextFunction
): void {
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
