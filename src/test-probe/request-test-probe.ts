import { Request, Response, NextFunction } from '../index';
import { log } from '../log';

/**
 * Request Test Probe: Log data about the current request
 */
export function requestTestProbe(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	log.debug('[Request Test Probe]\n');
	log.debug('payload\n', request.payload);

	if (request.query instanceof Object) {
		log.debug('query\n', request.query);
	}

	if (request.body instanceof Object) {
		log.debug('body\n', request.body);
	}

	log.debug(
		'\n------------------------------------------------------------'
	);

	next();
}
