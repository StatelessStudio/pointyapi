import { log } from '../log';

/**
 * # Start listening
 *
 * Start listening on the desired port. This is called in the default
 * pointy start() method.
 */

/**
 * Start listening
 * @param app Express app to listen on
 * @param port Port number to listen to. Default is process.env.PORT or 8080
 */
export async function listen(
	app: any,
	port?: number,
) {
	port = port || +process.env.PORT || 8080;

	await app.listen(port, () => {
		log.info('Server started.');
		log.info(`Server listening on port ${port}`);
	});
}
