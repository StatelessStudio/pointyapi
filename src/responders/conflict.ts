export function conflictResponder(result: any) {
	// Send response
	this.response.status(409).json(result);
}
