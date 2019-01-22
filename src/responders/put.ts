/**
 * Put Responder
 * @param result any Result to send (as JSON)
 */
export function putResponder(result: any): void {
	if (result instanceof Object) {
		// Send response
		this.response.sendStatus(204);
	}
	else {
		// Send error
		this.response.error('ID not found in Put Response');
	}
}
