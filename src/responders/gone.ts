export function goneResponder(result: any) {
	// Send response
	this.response.status(410).json(result);
}
