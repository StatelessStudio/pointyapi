import 'jasmine';
import { listen } from '../../../../src/utils';

/**
 * listen()
 * pointyapi/utils
 */
describe('[Utils] listen()', async () => {
	it('calls app.listen', async () => {
		let result = false;

		const app = {
			listen: (_, cb) => {
				result = true;
				cb();
			}
		};

		await listen(app, 80);

		expect(result).toBe(true);
	});
});
