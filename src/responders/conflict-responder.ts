/**
 * Respond with 409 Conflic
 * @param result Response to send (as JSON)
 */
export function conflictResponder(result: any): void {
	// Send response
	this.response.status(409).json(result);
}
