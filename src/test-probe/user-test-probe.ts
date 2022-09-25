import { Request, Response, NextFunction } from '../index';
import { log } from '../log';

/**
 * User Test Probe: Log data about the current authenticated user
 */
export function userTestProbe(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	log.debug('[User Test Probe]\n');
	log.debug('user\n', request.user);
	log.debug('userType\n', request.userType);

	log.debug(
		'\n------------------------------------------------------------'
	);

	next();
}
