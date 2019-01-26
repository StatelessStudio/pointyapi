/**
 * Respond with 200 Success & result set, or goneResponder()
 * 	if the result is empty
 * @param result any Result set to send
 */
export function getResponder(result: any): void {
	if (!result) {
		// No result, respond with 410 Gone
		this.response.goneResponder(result);
	}
	else {
		if (result) {
			// Send response
			this.response.json(result);
		}
		else {
			// Send unauthorized (bodyguard removed all fields)
			this.response.unauthorizedResponder(result);
		}
	}
}
