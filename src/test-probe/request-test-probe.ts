import { Request, Response, NextFunction } from 'express';

export function requestTestProbe(
	request: Request,
	response: Response,
	next: NextFunction
) {
	console.log('\n[DEBUG] [Request Test Probe]\n');
	console.log('payload\n', request.payload);

	if (request.query instanceof Object) {
		console.log('query\n', request.query);
	}

	if (request.body instanceof Object) {
		console.log('body\n', request.body);
	}

	console.log(
		'\n------------------------------------------------------------'
	);

	next();
}
