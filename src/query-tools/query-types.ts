/**
 * Specify allowed query-types and allowed values
 */
export const queryTypes = {
	select: [ 'array' ],
	where: [ 'object' ],
	whereAnyOf: [ 'object' ],
	search: [ 'string', 'object' ],
	not: [ 'object' ],
	raw: [ 'boolean', 'string' ],
	join: [ 'array' ],
	between: [ 'object' ],
	lessThan: [ 'object' ],
	lessThanOrEqual: [ 'object' ],
	greaterThan: [ 'object' ],
	greaterThanOrEqual: [ 'object' ],
	groupBy: [ 'array' ],
	order: [ 'string' ],
	orderBy: [ 'object' ],
	limit: [ 'number', 'string' ],
	offset: [ 'number', 'string' ],
	count: [ 'boolean', 'string' ],
	additionalParameters: [ 'object' ],
	id: [ 'number', 'string' ]
};

/**
 * Specify allowed query-type keys
 */
export const queryTypeKeys = Object.keys(queryTypes);
