import { QueryColumnReference } from '../../../../src/query-tools/query-column-reference';

/**
 * QueryColumnReference
 * pointyapi/query-tools
 */
describe('[QueryTools] QueryColumnReference', () => {
	it('does not set isReference for a string', () => {
		const ref = new QueryColumnReference('hello', 'obj');
		expect(ref.isReference).toBeFalse();
		expect(ref.str()).toBeNull();
	});

	it('does not set isReference for an object', () => {
		const ref = new QueryColumnReference({ foo: 'bar' }, 'obj');
		expect(ref.isReference).toBeFalse();
		expect(ref.str()).toBeNull();
	});

	it('sets isReference for a column ref', () => {
		const ref = new QueryColumnReference({ column: 'fname' }, 'obj');
		expect(ref.isReference).toBeTrue();
		expect(ref.str()).toEqual('"obj".fname');
	});

	it('sets column', () => {
		const ref = new QueryColumnReference({ column: 'fname' }, 'obj');
		expect(ref.column).toEqual('fname');
		expect(ref.str()).toEqual('"obj".fname');
	});

	it('sets default table', () => {
		const ref = new QueryColumnReference({ column: 'fname' }, 'asdf');
		expect(ref.table).toEqual('asdf');
		expect(ref.str()).toEqual('"asdf".fname');
	});

	it('sets table', () => {
		const ref = new QueryColumnReference({ column: 'fname', table: 'user' }, 'obj');
		expect(ref.table).toEqual('user');
		expect(ref.str()).toEqual('"user".fname');
	});
});
