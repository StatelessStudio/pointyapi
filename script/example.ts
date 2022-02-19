import { env } from '../src/environment';

/**
 * Do something!
 */
export async function example(): Promise<void> {
	console.log(env.APP_TITLE);
	console.log(env.NODE_ENV);
}
