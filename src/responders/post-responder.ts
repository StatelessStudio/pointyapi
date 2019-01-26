/**
 * Respond with 200 Success with post body
 * @param result any Post result body to send back (as JSON)
 */
export function postResponder(result: any): void {
	// Result should have ID
	if (result instanceof Object || result instanceof Array) {
		// Send response
		this.response.json(result);
	}
	else {
		// Send error
		this.response.error('ID not found in Post Response');
	}
}
