import { BaseDb } from '../../../../src/database';

/**
 * BaseDb
 * pointyapi/database
 */
describe('[BaseDb]', () => {
	beforeAll(() => {
		this.baseDb = new BaseDb();
	});

	it('contains a logger function', () => {
		expect(this.baseDb.logger).toEqual(jasmine.any(Function));
	});

	it('contains an error handler function', () => {
		expect(this.baseDb.errorHandler).toEqual(jasmine.any(Function));
	});

	it('contains setEntities() & allows chaining', () => {
		expect(this.baseDb.setEntities([])).toEqual(this.baseDb);
	});

	it('contains connect() & returns a promise', () => {
		expect(this.baseDb.connect({})).toEqual(jasmine.any(Promise));
	});
});
