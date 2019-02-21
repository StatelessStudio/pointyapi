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
	orderBy: [ 'object' ],
	limit: [ 'number', 'string' ],
	offset: [ 'number', 'string' ],
	count: [ 'boolean', 'string' ],
	id: [ 'number', 'string' ]
};

export const queryTypeKeys = Object.keys(queryTypes);
