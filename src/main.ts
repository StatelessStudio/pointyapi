import { log } from './log';
import { env } from './environment';

/**
 * Start your application in the main() function
 */
export async function main() {
	log.info('Hello ' + env.APP_TITLE);
}
