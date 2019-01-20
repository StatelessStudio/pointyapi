export function deleteResponder(result: any) {
	if (result instanceof Object) {
		// Send response
		this.response.sendStatus(204);
	}
	else {
		// Send error
		this.response.error('ID not found in Delete Response');
	}
}
