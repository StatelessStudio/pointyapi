import { LogHandlerFunction } from '../method-interface';

/**
 * # Start listening
 *
 * Start listening on the desired port.  This is called in the default
 * pointy start() method.
 */

/**
 * Start listening
 * @param app Express app to listen on
 * @param port Port number to listen to.  Default is process.env.PORT or 8080
 * @param logger Logger function to log to
 */
export async function listen(
	app: any,
	port?: number,
	logger?: LogHandlerFunction
) {
	port = port || +process.env.PORT || 8080;

	await app.listen(port, () => {
		logger('Server started.');
		logger(`Server listening on port ${port}`);

		// Send IPC notification
		if ('send' in process && process.send) {
			process.send('server-ready');
		}
	});
}
