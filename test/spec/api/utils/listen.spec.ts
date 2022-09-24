import 'jasmine';
import { listen } from '../../../../src/utils';

/**
 * listen()
 * pointyapi/utils
 */
describe('[Utils] listen()', async () => {
	beforeAll(() => {});

	it('calls app.listen', async () => {
		const app = {
			listen: (_, cb) => {
				cb();
			}
		};

		let result = false;
		app.listen = () => (result = true);

		await listen(app, 80, () => {});

		expect(result).toBe(true);
	});

	it('calls the logger function', async () => {
		const app = {
			listen: (_, cb) => {
				cb();
			}
		};

		let result = false;

		await listen(app, 80, () => {
			result = true;
		});

		expect(result).toBe(true);
	});
});
