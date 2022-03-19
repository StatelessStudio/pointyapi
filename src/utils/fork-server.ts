import * as fs from 'fs';

/**
 * # Fork Server
 *
 * Fork the server for testing
 *
 * ```typescript
 * import { pointy } from '../../../src/index';
 * import { forkServer } from '../../../src/fork-server';
 *
 * const http = pointy.http;
 *
 * let serverfork;
 *
 * beforeAll(async () => {
 * 	serverfork = await forkServer('./dist/test/examples/basic/server.js');
 * });
 *
 * afterAll(() => {
 * 	if (serverfork) {
 * 		serverfork.kill();
 * 	}
 * });
 *
 * describe('API Server', () => {
 * 	it('is running', async () => {
 * 		await http
 * 			.get('/', {}, undefined, [ 200, 404 ])
 * 			.catch((error) => fail(error));
 * 	});
 * });
 * ```
 *
 */

/**
 * Fork Server
 */
import { fork } from 'child_process';

/**
 * Fork the server from a test-suite
 * @param serverFile File path to the server entry-point
 * @return Returns a Promise
 */
export function forkServer(
	serverFile: string,
	args: string[] = [ 'testmode' ]
): Promise<any> {
	return new Promise((accept, reject) => {
		fs.access(serverFile, (error) => {
			if (error) {
				reject('Could not read server file: ' + JSON.stringify(error));
			}
			else {
				const serverfork = fork(serverFile, args);

				serverfork.on('message', (message) => {
					accept(serverfork);
				});
			}
		});
	});
}
