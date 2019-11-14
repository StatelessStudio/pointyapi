import { BaseDb } from '../../../../src/database';

/**
 * BaseDb
 * pointyapi/database
 */
describe('[BaseDb]', () => {
	let baseDb;
	let clog;
	let cerr;

	beforeAll(() => {
		baseDb = new BaseDb();
	});

	beforeEach(() => {
		clog = console.log;
		cerr = console.error;
	});

	afterEach(() => {
		console.log = clog;
		console.error = cerr;
	});

	it('contains setEntities() & allows chaining', () => {
		expect(baseDb.setEntities([])).toEqual(baseDb);
	});

	it('contains connect() & returns a promise', () => {
		expect(baseDb.connect({})).toEqual(jasmine.any(Promise));
	});

	it('can log a message', () => {
		let result = false;

		console.log = () => {
			result = true;
		};

		baseDb.logger();
		expect(result).toBe(true);
	});
});
