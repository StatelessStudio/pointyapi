export function unauthorizedResponder(result: any) {
	this.response.status(401).json(result);
}
