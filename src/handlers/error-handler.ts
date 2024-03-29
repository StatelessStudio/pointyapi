import { log } from '../log';

/**
 * Default error handler
 * @param error Error message/object to send to the client (or
 * 	database error object to check)
 * @param code Error response code to send. Default is 500
 */
export function errorHandler(error: any, code = 500): void {
	// Check for known errors
	if (error instanceof Object && 'code' in error && this.response) {
		error.code = +error.code;

		if (error.code === 23502) {
			// Not-null violation
			this.response.validationResponder([
				{
					property: error.column,
					constraints: {
						isNotNull: error.message
					}
				}
			]);
			return;
		}
		else if (error.code === 23503) {
			// Foreign key violation
			this.response.conflictResponder('Foreign Key Violation');
			return;
		}
		else if (error.code === 23505) {
			// Duplicate key value
			this.response.conflictResponder(
				'Duplicate Key Value: ' + error.detail
			);
			return;
		}
	}

	// Unkown Errors
	log.error('[Request Error]', error);

	if (this.response) {
		this.response.sendStatus(code);
	}
	else {
		throw error;
	}
}
