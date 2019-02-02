import { forkServer } from '../../../../src/utils';

/**
 * forkServer()
 * pointyapi/utils
 */
describe('[Utils] forkServer()', async () => {
	it('starts a server', async () => {
		const serverfork = await forkServer(
			'./lib/test/examples/api/server.js'
		).catch((error) =>
			fail('Could not start server: ' + JSON.stringify(error))
		);

		expect(serverfork).toBeTruthy();

		if (serverfork) {
			serverfork.kill();
		}
	});
});
