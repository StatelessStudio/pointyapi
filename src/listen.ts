import { LogHandlerFunction } from './method-interface';

/**
 * # Start listening
 *
 * Start listening on the desired port.  This is called in the default
 * pointy start() method.
 */

/**
 * Start listening
 */
export async function listen(
	app: any,
	port?: number,
	logger?: LogHandlerFunction
) {
	if ('listen' in app) {
		await app.listen(port, () => {
			logger('Server started.');
			logger(`Server listening on port ${process.env.PORT}`);

			// Send IPC notification
			if ('send' in process && process.send) {
				process.send('server-ready');
			}
		});
	}
	else {
		throw new Error(`App doesn't contain listen method.`);
	}
}
