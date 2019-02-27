/**
 * Respond with 410 Gone
 * @param result Result to send (as JSON)
 */
export function goneResponder(result: any): void {
	// Send response
	this.response.status(410).json(result);
}
