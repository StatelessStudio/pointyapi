import { log } from './log';

/**
 * Initialize & register your app's services here
 */
export async function register(): Promise<void> {
	log.info('Booting...');

	// TODO: Register services here
}

/**
 * Teardown services here
 */
export async function teardown(): Promise<void> {
	log.info('Tearing down...');

	// TODO: Teardown services here
}
