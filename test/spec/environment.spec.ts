import 'jasmine';
import { env } from '../../src/environment';

describe('Environment', () => {
	it('can load', () => {
		expect(env).toBeDefined();
	});

	it('has app_title key', () => {
		expect(typeof env.APP_TITLE).toBe(typeof 'string');
	});
});
