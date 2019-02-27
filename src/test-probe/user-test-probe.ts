import { Request, Response, NextFunction } from 'express';

/**
 * User Test Probe: Log data about the current authenticated user
 */
export function userTestProbe(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	console.log('\n[DEBUG] [User Test Probe]\n');
	console.log('user\n', request.user);
	console.log('userType\n', request.userType);

	console.log(
		'\n------------------------------------------------------------'
	);

	next();
}
