import { forkServer } from '../../../../src/utils';

/**
 * forkServer()
 * pointyapi/utils
 */
describe('[Utils] forkServer()', async () => {
	it('starts a server', async () => {
		const serverfork = await forkServer(
			'./dist/test/examples/api/server.js'
		).catch((error) =>
			fail('Could not start server: ' + JSON.stringify(error))
		);

		expect(serverfork).toBeTruthy();

		if (serverfork) {
			serverfork.kill();
		}
	});

	it('rejects if the server is not a valid file', async () => {
		let result = false;
		const serverfork = await forkServer('invalid')
			.then(fail)
			.catch((error) => {
				result = true;
			});

		expect(result).toBe(true);
	});
});
