/**
 * Respond with 403 Forbidden
 * @param result Result to send (as JSON)
 */
export function forbiddenResponder(result: any): void {
	this.response.status(403).json(result);
}
