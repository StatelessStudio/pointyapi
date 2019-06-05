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
	// Set Access-Control-Allow-Origin
	let origin = '*';

	if ('CLIENT_URL' in process.env && process.env.CLIENT_URL) {
		if (process.env.CLIENT_URL.includes(', ')) {
			// Array of Client URLs
			const host = request.header('host').toLowerCase();
			const clientUrls = process.env.CLIENT_URL.split(', ');

			if (clientUrls.includes(host)) {
				origin = host;
			}
			else {
				origin = clientUrls[0];
			}
		}
		else if (typeof process.env.CLIENT_URL === 'string') {
			// Single Client Url
			origin = process.env.CLIENT_URL;
		}
	}
	response.setHeader('Access-Control-Allow-Origin', origin);

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
