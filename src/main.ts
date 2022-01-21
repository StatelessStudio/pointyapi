import { logger } from './logger';
import { env } from './environment';

/**
 * Start your application in the main() function
 */
export async function main() {
	logger.info('Hello ' + env.APP_TITLE);
}
