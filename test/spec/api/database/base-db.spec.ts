import 'jasmine';
import { BaseDb } from '../../../../src/database';

/**
 * BaseDb
 * pointyapi/database
 */
describe('[BaseDb]', () => {
	let baseDb;

	beforeAll(() => {
		baseDb = new BaseDb();
	});

	it('contains setEntities() & allows chaining', () => {
		expect(baseDb.setEntities([])).toEqual(baseDb);
	});

	it('contains connect() & returns a promise', () => {
		expect(baseDb.connect({})).toEqual(jasmine.any(Promise));
	});
});
