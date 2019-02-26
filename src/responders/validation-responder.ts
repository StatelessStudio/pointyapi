/**
 * Respond with 400 Bad Request
 * @param errors Errors to send (as json)
 */
export function validationResponder(errors: any): void {
	this.response.status(400);
	this.response.json({
		validation: errors
	});
}
