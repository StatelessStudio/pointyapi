import { log } from './log';
import { env } from './environment';

/**
 * Start your application in the main() function
 */
export async function main(): Promise<void> {
	log.info('Hello ' + env.APP_TITLE);
}
