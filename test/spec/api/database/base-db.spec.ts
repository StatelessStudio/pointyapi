import { BaseDb } from '../../../../src/database';

/**
 * BaseDb
 * pointyapi/database
 */
describe('[BaseDb]', () => {
	beforeAll(() => {
		this.baseDb = new BaseDb();
	});

	beforeEach(() => {
		this.clog = console.log;
		this.cerr = console.error;
	});

	afterEach(() => {
		console.log = this.clog;
		console.error = this.cerr;
	});

	it('contains setEntities() & allows chaining', () => {
		expect(this.baseDb.setEntities([])).toEqual(this.baseDb);
	});

	it('contains connect() & returns a promise', () => {
		expect(this.baseDb.connect({})).toEqual(jasmine.any(Promise));
	});

	it('can log a message', () => {
		let result = false;

		console.log = () => {
			result = true;
		};

		this.baseDb.logger();
		expect(result).toBe(true);
	});
});
