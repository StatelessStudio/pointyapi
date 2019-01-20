export function putResponder(result: any) {
	if (result instanceof Object) {
		// Send response
		this.response.sendStatus(204);
	}
	else {
		// Send error
		this.response.error('ID not found in Put Response');
	}
}
