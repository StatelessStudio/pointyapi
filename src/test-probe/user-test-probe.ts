import { Request, Response, NextFunction } from 'express';

export function userTestProbe(
	request: Request,
	response: Response,
	next: NextFunction
) {
	console.log('\n[DEBUG] [User Test Probe]\n');
	console.log('user\n', request.user);
	console.log('userType\n', request.userType);

	console.log(
		'\n------------------------------------------------------------'
	);

	next();
}
