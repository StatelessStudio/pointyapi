export interface Query
{
	id?: number|string,
	count?: boolean,
	raw?: boolean,
	select?: string[],
	join?: string[],
	search?: string,
	groupBy?: string[],
	order?: 'random',
	orderBy?: object,
	limit?: number,
	offset?: number
}
