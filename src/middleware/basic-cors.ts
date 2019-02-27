import { Request, Response, NextFunction } from 'express';

/**
 * Basic CORS Middleware
 * @param request Express request
 * @param response Express response
 * @param next Next function to call on success
 */
export function basicCors(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader(
		'Access-Control-Allow-Methods',
		'POST, GET, PATCH, DELETE, OPTIONS'
	);
	response.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With, Content-Type, Authorization, Cache-Control'
	);
	response.setHeader('Access-Control-Allow-Credentials', 'true');
	response.setHeader('Content-Type', 'application/json;charset=utf-8');

	next();
}
