import { env } from '../environment';
import { Request, Response, NextFunction } from '../index';

/**
 * Basic CORS Middleware
 * @param request Express request
 * @param response Express response
 * @param next Next function to call on success
 */
export function basicCors(
	request: Request,
	response: Response,
	next: NextFunction,
	allowedOrigins: string = env.ALLOW_ORIGIN,
): void {
	// Set Access-Control-Allow-Origin
	let origin = '*';

	if (allowedOrigins) {
		if (allowedOrigins.includes(', ')) {
			// Array of Client URLs
			const host = request.headers.origin;
			const clientUrls = allowedOrigins.split(', ');

			if (clientUrls.includes(host)) {
				origin = host;
			}
			else {
				origin = clientUrls[0];
			}
		}
		else {
			// Single Client Url
			origin = allowedOrigins;
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
