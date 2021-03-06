/**
 * Respond with 401 Unauthorized
 * @param result Result to send (as JSON)
 */
export function unauthorizedResponder(result: any): void {
	this.response.status(401).json(result);
}
