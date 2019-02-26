/**
 * Patch Responder
 * @param result Result to send (as JSON)
 */
export function patchResponder(result: any): void {
	if (result instanceof Object) {
		// Send response
		this.response.sendStatus(204);
	}
	else {
		// Send error
		this.response.error('ID not found in Patch Response');
	}
}
