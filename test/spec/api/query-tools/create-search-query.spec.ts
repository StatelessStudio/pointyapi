import { createSearchQuery } from '../../../../src/utils';
import { ExampleUser } from '../../../../src/models';
import { ExampleRelation } from '../../../examples/api/models/example-relation';

/**
 * createSearchQuery()
 * pointyapi/query-tools
 */
describe('[QueryTools] createSearchQuery()', () => {
	it('can run where query', () => {
		const query = {
			where: {
				fname: 'Tom',
				lname: 'Jones'
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('(obj.fname=:where_fname AND obj.lname=:where_lname)');
		expect(queryParams).toEqual({
			where_fname: query.where.fname,
			where_lname: query.where.lname
		});
	});

	it('can run whereAnyOf query', () => {
		const query = {
			whereAnyOf: {
				fname: 'Tom',
				lname: 'Jones'
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('(obj.fname=:whereAnyOf_fname OR obj.lname=:whereAnyOf_lname)');
		expect(queryParams).toEqual({
			whereAnyOf_fname: query.whereAnyOf.fname,
			whereAnyOf_lname: query.whereAnyOf.lname
		});
	});

	it('can run search string query', () => {
		const query = {
			search: 'hello world'
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe(
			'(LOWER(obj.username) LIKE :search OR LOWER(obj.email) LIKE :search OR' +
				' LOWER(obj.fname) LIKE :search OR LOWER(obj.lname) LIKE :search)'
		);
		expect(queryParams).toEqual({ search: '%hello%world%' });
	});

	it('can run search object query', () => {
		const query = {
			search: { fname: 'hello world' }
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('(LOWER(obj.fname) LIKE :search_fname)');
		expect(queryParams).toEqual({ search_fname: '%hello%world%' });
	});

	it('can run search string query on relation', () => {
		const query = {
			search: 'hello world'
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleRelation,
			query
		);

		expect(queryString).toBe('(LOWER(owner.username) LIKE :search)');
		expect(queryParams).toEqual({ search: '%hello%world%' });
	});

	it('can run between query', () => {
		const query = {
			between: {
				id: [ 0, 250 ]
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('(obj.id BETWEEN 0 AND 250)');
		expect(queryParams).toEqual({});
	});

	it('can run lessThan query', () => {
		const query = {
			lessThan: {
				id: 100
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.id < :lessThan_id');
		expect(queryParams).toEqual({ lessThan_id: '100' });
	});

	it('can run lessThanOrEqual query', () => {
		const query = {
			lessThanOrEqual: {
				id: 100
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.id <= :lessThanOrEqual_id');
		expect(queryParams).toEqual({ lessThanOrEqual_id: '100' });
	});

	it('can run greaterThan query', () => {
		const query = {
			greaterThan: {
				id: 100
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.id > :greaterThan_id');
		expect(queryParams).toEqual({ greaterThan_id: '100' });
	});

	it('can run greaterThanOrEqual query', () => {
		const query = {
			greaterThanOrEqual: {
				id: 100
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.id >= :greaterThanOrEqual_id');
		expect(queryParams).toEqual({ greaterThanOrEqual_id: '100' });
	});

	it('can run not query', () => {
		const query = {
			not: {
				fname: 'Tom',
				lname: 'Jones'
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.fname!=:not_fname AND obj.lname!=:not_lname');
		expect(queryParams).toEqual({
			not_fname: query.not.fname,
			not_lname: query.not.lname
		});
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

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe(
			'(obj.status=:where_status) AND obj.fname!=:not_fname AND obj.lname!=:not_lname'
		);
		expect(queryParams).toEqual({
			where_status: 'active',
			not_fname: 'Tom',
			not_lname: 'Jones'
		});
	});

	it('seperates query params based on query type', () => {
		const query = {
			where: {
				fname: 'Where'
			},
			whereAnyOf: {
				fname: 'AnyOf1,AnyOf2'
			},
			lessThan: {
				fname: 'z'
			},
			lessThanOrEqual: {
				fname: 'z'
			},
			greaterThan: {
				fname: 'a'
			},
			greaterThanOrEqual: {
				fname: 'a'
			},
			not: {
				fname: 'not'
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe(
			'(obj.fname=:where_fname) AND (obj.fname=:whereAnyOf_fname) AND obj.fname < :lessThan_fname AND obj.fname <= :lessThanOrEqual_fname AND obj.fname > :greaterThan_fname AND obj.fname >= :greaterThanOrEqual_fname AND obj.fname!=:not_fname'
		);
		expect(queryParams).toEqual({
			where_fname: query.where.fname,
			whereAnyOf_fname: query.whereAnyOf.fname,
			lessThan_fname: query.lessThan.fname,
			lessThanOrEqual_fname: query.lessThanOrEqual.fname,
			greaterThan_fname: query.greaterThan.fname,
			greaterThanOrEqual_fname: query.greaterThanOrEqual.fname,
			not_fname: query.not.fname
		});
	});
});
