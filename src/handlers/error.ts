import { createTimestamp } from './create-timestamp';

export function errorHandler(error: any, code = 500) {
	// Check for known errors
	if (error instanceof Object && 'code' in error && this.response) {
		error.code = +error.code;

		if (error.code === 23502) {
			// Not-null violation
			this.response.validationResponder('Not null violation');
			return;
		}
		else if (error.code === 23503) {
			// Foreign key violation
			this.response.sendStatus(409);
			return;
		}
		else if (error.code === 23505) {
			// Duplicate key value
			this.response.sendStatus(409);
			return;
		}
	}

	// Unkown Errors
	console.error('[SERVER] ERROR', createTimestamp(), error);

	if (this.response) {
		this.response.sendStatus(code);
	}
}
