import { env } from '../environment';
import { log } from '../log';

export type ListenFunction = (app: any, port?: number) => Promise<void>;

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
export const listen: ListenFunction = async (
	app: any,
	port?: number,
) => {
	return new Promise<void>((accept, reject) => {
		port = port || env.PORT;

		app.listen(port, () => {
			log.info(`Server listening on port ${port}`);

			accept();
		});
	});
};
