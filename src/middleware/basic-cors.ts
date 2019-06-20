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

	// Backwards compatability
	// TODO: Remove in v3.0.0
	if (!('ALLOW_ORIGIN' in process.env) && 'CLIENT_URL' in process.env) {
		process.env.ALLOW_ORIGIN = process.env.CLIENT_URL;
	}

	if ('ALLOW_ORIGIN' in process.env && process.env.ALLOW_ORIGIN) {
		if (process.env.ALLOW_ORIGIN.includes(', ')) {
			// Array of Client URLs
			let host = request.headers.origin;
			const clientUrls = process.env.ALLOW_ORIGIN.split(', ');

			if (host instanceof Array) {
				host = host[0];
			}

			if (clientUrls.includes(host)) {
				origin = host;
			}
			else {
				origin = clientUrls[0];
			}
		}
		else if (typeof process.env.ALLOW_ORIGIN === 'string') {
			// Single Client Url
			origin = process.env.ALLOW_ORIGIN;
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
