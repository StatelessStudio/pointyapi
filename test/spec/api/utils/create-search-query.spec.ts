import { createSearchQuery } from '../../../../src/utils';
import { BaseUser } from '../../../../src/models';
import { ExampleRelation } from '../../../examples/api/models/example-relation';

/**
 * createSearchQuery()
 * pointyapi/utils
 */
describe('[Utils] createSearchQuery()', () => {
	it('can run where query', () => {
		const query = {
			where: {
				fname: 'Tom',
				lname: 'Jones'
			}
		};

		const { queryString, queryParams } = createSearchQuery(BaseUser, query);

		expect(queryString).toBe('(obj.fname=:fname AND obj.lname=:lname)');
		expect(queryParams).toEqual(query.where);
	});

	it('can run whereAnyOf query', () => {
		const query = {
			whereAnyOf: {
				fname: 'Tom',
				lname: 'Jones'
			}
		};

		const { queryString, queryParams } = createSearchQuery(BaseUser, query);

		expect(queryString).toBe('(obj.fname=:fname OR obj.lname=:lname)');
		expect(queryParams).toEqual(query.whereAnyOf);
	});

	it('can run search string query', () => {
		const query = {
			search: 'hello world'
		};

		const { queryString, queryParams } = createSearchQuery(BaseUser, query);

		expect(queryString).toBe(
			'(obj.username LIKE :search OR obj.fname LIKE :search OR' +
				' obj.lname LIKE :search OR obj.email LIKE :search)'
		);
		expect(queryParams).toEqual({ search: '%hello%world%' });
	});

	it('can run search string query on relation', () => {
		const query = {
			search: 'hello world'
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleRelation,
			query
		);

		expect(queryString).toBe('(owner.id LIKE :search)');
		expect(queryParams).toEqual({ search: '%hello%world%' });
	});

	it('can run between query', () => {
		const query = {
			between: {
				id: [ 0, 250 ]
			}
		};

		const { queryString, queryParams } = createSearchQuery(BaseUser, query);

		expect(queryString).toBe('(obj.id BETWEEN 0 AND 250)');
		expect(queryParams).toEqual({});
	});

	it('can run lessThan query', () => {
		const query = {
			lessThan: {
				id: 100
			}
		};

		const { queryString, queryParams } = createSearchQuery(BaseUser, query);

		expect(queryString).toBe('obj.id < :id');
		expect(queryParams).toEqual({ id: '100' });
	});

	it('can run lessThanOrEqual query', () => {
		const query = {
			lessThanOrEqual: {
				id: 100
			}
		};

		const { queryString, queryParams } = createSearchQuery(BaseUser, query);

		expect(queryString).toBe('obj.id <= :id');
		expect(queryParams).toEqual({ id: '100' });
	});

	it('can run greaterThan query', () => {
		const query = {
			greaterThan: {
				id: 100
			}
		};

		const { queryString, queryParams } = createSearchQuery(BaseUser, query);

		expect(queryString).toBe('obj.id > :id');
		expect(queryParams).toEqual({ id: '100' });
	});

	it('can run greaterThanOrEqual query', () => {
		const query = {
			greaterThanOrEqual: {
				id: 100
			}
		};

		const { queryString, queryParams } = createSearchQuery(BaseUser, query);

		expect(queryString).toBe('obj.id >= :id');
		expect(queryParams).toEqual({ id: '100' });
	});

	it('can run not query', () => {
		const query = {
			not: {
				fname: 'Tom',
				lname: 'Jones'
			}
		};

		const { queryString, queryParams } = createSearchQuery(BaseUser, query);

		expect(queryString).toBe('obj.fname!=:fname AND obj.lname!=:lname');
		expect(queryParams).toEqual(query.not);
	});

	it('can run multiple queries', () => {
		const query = {
			where: {
				status: 'active'
			},
			not: {
				fname: 'Tom',
				lname: 'Jones'
			}
		};

		const { queryString, queryParams } = createSearchQuery(BaseUser, query);

		expect(queryString).toBe(
			'(obj.status=:status) AND obj.fname!=:fname AND obj.lname!=:lname'
		);
		expect(queryParams).toEqual({
			status: 'active',
			fname: 'Tom',
			lname: 'Jones'
		});
	});
});
