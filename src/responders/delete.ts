/**
 * Delete Responder
 * @param result any Respond with 204 Success: No-Content
 * 	if the result is successful
 */
export function deleteResponder(result: any): void {
	if (result instanceof Object) {
		// Send response
		this.response.sendStatus(204);
	}
	else {
		// Send error
		this.response.error('ID not found in Delete Response');
	}
}
