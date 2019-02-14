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
 * 	serverfork = await forkServer('./lib/test/examples/basic/server.js');
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
 * 			.get('/', {}, [ 200, 404 ])
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
 * @param serverFile string File path to the server entry-point
 */
export function forkServer(serverFile: string): Promise<any> {
	return new Promise((accept, reject) => {
		fs.access(serverFile, (error) => {
			if (error) {
				reject('Could not read server file: ' + JSON.stringify(error));
			}
			else {
				const serverfork = fork(serverFile);

				serverfork.on('message', (message) => {
					accept(serverfork);
				});
			}
		});
	});
}
