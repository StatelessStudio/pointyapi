export interface Query {
	id?: number|string,
	count?: boolean,
	raw?: boolean,
	select?: string[],
	join?: string[],
	where?: Record<string, any>,
	whereAnyOf?: Record<string, any>,
	search?: string | object,
	between?: Record<string, any>,
	lessThan?: Record<string, any>,
	greaterThan?: Record<string, any>,
	lessThanOrEqual?: Record<string, any>,
	greaterThanOrEqual?: Record<string, any>,
	not?: Record<string, any>,
	groupBy?: string[],
	order?: 'random',
	orderBy?: Record<string, any>,
	limit?: number,
	offset?: number
}
