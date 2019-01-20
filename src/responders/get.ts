export function getResponder(result: any) {
	if (!result) {
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
