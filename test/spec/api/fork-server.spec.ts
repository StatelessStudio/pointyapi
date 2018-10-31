import { forkServer } from '../../../src/fork-server';

describe('forkServer', () => {
	it('starts a server', async () => {
		let serverResult: any = false;
		const server = await forkServer('./lib/test/examples/basic/server.js')
			.then((result) => (serverResult = result))
			.catch((error) => fail(error));
	});
});
