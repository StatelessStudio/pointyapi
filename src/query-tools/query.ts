export interface Query
{
	id?: number|string,
	count?: boolean,
	raw?: boolean,
	select?: string[],
	join?: string[],
	where?: object,
	whereAnyOf?: object,
	search?: string | object,
	between?: object,
	lessThan?: object,
	greaterThan?: object,
	lessThanOrEqual?: object,
	greaterThanOrEqual?: object,
	not?: object,
	groupBy?: string[],
	order?: 'random',
	orderBy?: object,
	limit?: number,
	offset?: number
}
