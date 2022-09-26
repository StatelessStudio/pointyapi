import 'jasmine';
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

		expect(queryString).toBe('obj.fname=:where_fname AND obj.lname=:where_lname');
		expect(queryParams).toEqual({
			where_fname: query.where.fname,
			where_lname: query.where.lname
		});
	});

	it('can run where on another column', () => {
		const query = {
			where: {
				fname: {
					column: 'lname'
				}
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.fname="obj".lname');
		expect(queryParams).toEqual({});
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

	it('can run whereAnyOf on another column', () => {
		const query = {
			whereAnyOf: {
				fname: {
					column: 'lname'
				},
				email: {
					column: 'fname'
				}
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('(obj.fname="obj".lname OR obj.email="obj".fname)');
		expect(queryParams).toEqual({});
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

		expect(queryString).toBe('(obj.id BETWEEN :between_id0 AND :between_id1)');
		expect(queryParams).toEqual({
			between_id0: 0,
			between_id1: 250
		});
	});

	it('can run between on another column', () => {
		const query = {
			between: {
				id: [
					{
						column: 'fname'
					},
					250
				]
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('(obj.id BETWEEN "obj".fname AND :between_id1)');
		expect(queryParams).toEqual({
			between_id1: 250
		});
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

		expect(queryString).toBe('obj.id < :lt_id');
		expect(queryParams).toEqual({ lt_id: '100' });
	});

	it('can run lessThan on another column', () => {
		const query = {
			lessThan: {
				fname: {
					column: 'lname'
				}
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.fname < "obj".lname');
		expect(queryParams).toEqual({});
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

		expect(queryString).toBe('obj.id <= :lte_id');
		expect(queryParams).toEqual({ lte_id: '100' });
	});

	it('can run lessThanOrEqual on another column', () => {
		const query = {
			lessThanOrEqual: {
				fname: {
					column: 'lname'
				}
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.fname <= "obj".lname');
		expect(queryParams).toEqual({});
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

		expect(queryString).toBe('obj.id > :gt_id');
		expect(queryParams).toEqual({ gt_id: '100' });
	});

	it('can run greaterThan on another column', () => {
		const query = {
			greaterThan: {
				id: {
					column: 'fname'
				}
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.id > "obj".fname');
		expect(queryParams).toEqual({});
	});

	it('can run greaterThan on another joined column', () => {
		const query = {
			greaterThan: {
				id: {
					column: 'fname',
					table: 'user'
				}
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.id > "user".fname');
		expect(queryParams).toEqual({});
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

		expect(queryString).toBe('obj.id >= :gte_id');
		expect(queryParams).toEqual({ gte_id: '100' });
	});

	it('can run greaterThanOrEqual on another column', () => {
		const query = {
			greaterThanOrEqual: {
				id: {
					column: 'fname'
				}
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.id >= "obj".fname');
		expect(queryParams).toEqual({});
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

	it('can run not on another column', () => {
		const query = {
			not: {
				fname: {
					column: 'lname'
				}
			}
		};

		const { queryString, queryParams } = createSearchQuery(
			ExampleUser,
			query
		);

		expect(queryString).toBe('obj.fname!="obj".lname');
		expect(queryParams).toEqual({});
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
			'obj.status=:where_status AND obj.fname!=:not_fname AND obj.lname!=:not_lname'
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
			'obj.fname=:where_fname AND (obj.fname=:whereAnyOf_fname) AND obj.fname < :lt_fname AND obj.fname <= :lte_fname AND obj.fname > :gt_fname AND obj.fname >= :gte_fname AND obj.fname!=:not_fname'
		);
		expect(queryParams).toEqual({
			where_fname: query.where.fname,
			whereAnyOf_fname: query.whereAnyOf.fname,
			lt_fname: query.lessThan.fname,
			lte_fname: query.lessThanOrEqual.fname,
			gt_fname: query.greaterThan.fname,
			gte_fname: query.greaterThanOrEqual.fname,
			not_fname: query.not.fname
		});
	});
});
