export function postResponder(result: any) {
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
