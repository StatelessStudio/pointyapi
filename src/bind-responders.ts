import { Request, Response } from 'express';

/**
 * Bind the request and response to the handler & responder functions
 * @param to PointyAPI app instance to bind to
 * @param request Express Request to bind to
 * @param response Express Response to bind to
 */
export function bindResponders(to, request: Request, response: Response) {
	response.error = to.error.bind({
		request: request,
		response: response
	});
	response.log = to.log.bind({
		request: request,
		response: response
	});
	response.conflictResponder = to.conflictResponder.bind({
		request: request,
		response: response
	});
	response.forbiddenResponder = to.forbiddenResponder.bind({
		request: request,
		response: response
	});
	response.goneResponder = to.goneResponder.bind({
		request: request,
		response: response
	});
	response.unauthorizedResponder = to.unauthorizedResponder.bind({
		request: request,
		response: response
	});
	response.validationResponder = to.validationResponder.bind({
		request: request,
		response: response
	});
	response.deleteResponder = to.deleteResponder.bind({
		request: request,
		response: response
	});
	response.getResponder = to.getResponder.bind({
		request: request,
		response: response
	});
	response.postResponder = to.postResponder.bind({
		request: request,
		response: response
	});
	response.putResponder = to.putResponder.bind({
		request: request,
		response: response
	});
}
