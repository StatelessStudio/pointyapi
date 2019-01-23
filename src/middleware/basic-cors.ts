import { Request, Response, NextFunction } from 'express';

/**
 * Basic CORS Middleware
 *
 * 	Access-Control-Allow-Origin
 * 		'*'
 * 	Access-Control-Allow-Methods
 * 		'POST, GET, PUT, DELETE, OPTIONS'
 * 	Access-Control-Allow-Headers
 * 		'X-Requested-With, Content-Type, Authorization, Cache-Control'
 * 	Access-Control-Allow-Credentials
 * 		'true'
 *  Content-Type
 *		'application/json;charset=utf-8'
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
		'POST, GET, PUT, DELETE, OPTIONS'
	);
	response.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With, Content-Type, Authorization, Cache-Control'
	);
	response.setHeader('Access-Control-Allow-Credentials', 'true');
	response.setHeader('Content-Type', 'application/json;charset=utf-8');

	next();
}
