// The following imports are generic across all scripts
import { bootstrap } from 'ts-async-bootstrap';
import { register } from '../src/register';
import { errorHandler } from '../src/error-handler';

// These imports are specific to the example script, but may be used
// 	for others
import { log } from '../src/log';
import { env } from '../src/environment';

/**
 * Do something!
 */
export async function example(): Promise<void> {
	log.info('App Name: ', env.APP_TITLE);
	log.warn('Environment: ', env.NODE_ENV);
}

bootstrap({
	register,
	run: example,
	errorHandler: errorHandler
});
