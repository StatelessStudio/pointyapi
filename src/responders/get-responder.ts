/**
 * Respond with 200 Success & result set, or goneResponder()
 * 	if the result is empty
 * @param result any Result set to send
 */
export function getResponder(result: any): void {
	if (result) {
		// Send response
		this.response.json(result);
	}
	else {
		// No result, respond with 410 Gone
		this.response.goneResponder();
	}
}
