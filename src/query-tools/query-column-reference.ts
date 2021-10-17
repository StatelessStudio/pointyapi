export interface QueryColumnReferenceInterface {
	column: string;
	table?: string;
}

export class QueryColumnReference implements QueryColumnReferenceInterface {
	public isReference: boolean = false;
	public column: string;
	public table: string;

	public constructor(val: unknown, objKey: string) {
		if (val && typeof val === 'object' && 'column' in val) {
			const ref = val as QueryColumnReferenceInterface;
			this.column = ref.column;
			this.table = ref.table ? ref.table : objKey
			this.isReference = true;
		}
	}

	public str(): null|string {
		if (!this.isReference) {
			return null;
		}

		return `"${this.table}".${this.column}`;
	}
}
