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

export function forkServer(serverFile: string) {
	return new Promise((accept, reject) => {
		const serverfork = fork(serverFile);

		serverfork.on('message', (message) => {
			if (message === 'server-ready') {
				accept(serverfork);
			}
			else {
				reject(message);
			}
		});
	});
}
