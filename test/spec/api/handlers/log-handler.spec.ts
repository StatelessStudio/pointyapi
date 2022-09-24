import 'jasmine';
import { logHandler } from '../../../../src/handlers';

/**
 * logHandler()
 * pointyapi/handlers
 */
describe('[Handler] logHandler', () => {
	let clog;

	beforeAll(() => {
		// Store console in buffer
		clog = console.log;

		// Disable clog && cerr
		console.log = () => {};
	});

	afterAll(() => {
		// Release console
		console.log = clog;
	});

	it('logs a message', () => {
		let result = false;
		console.log = () => {
			result = true;
		};

		logHandler('test');
		expect(result).toBe(true);
	});

	it('logs data', () => {
		let result = 0;
		console.log = () => {
			result++;
		};

		logHandler('test', {});

		expect(result).toBe(2);
	});
});
