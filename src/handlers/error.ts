import { createTimestamp } from './create-timestamp';

/**
 * Default error handler
 * @param error any Error message/object to send to the client (or
 * 	database error object to check)
 * @param code number (Optional) Error response code to send.  Default is 500
 */
export function errorHandler(error: any, code: number = 500): void {
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
