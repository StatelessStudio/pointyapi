import { mockRequest, mockResponse } from 'mock-req-res';
import { getRepository } from 'typeorm';
import { ExampleUser } from '../models';

declare let fail;

/**
 * Create mock request/response objects
 * @param method HTTP method verb for this request
 * @param url URL to mock the request
 * @return Returns { request, response }
 */
export function createMockRequest(
	method = 'GET',
	url = '/api/v1/user'
) {
	// Create request
	const request = mockRequest();
	request.repository = getRepository(ExampleUser);
	request.method = method;
	request.baseUrl = url;
	request.userType = ExampleUser;
	request.payloadType = ExampleUser;
	request.joinMembers = [];
	request.identifier = 'id';
	request.header = (key) => (key === 'host' ? 'localhost' : false);

	// Create response
	const response = mockResponse();

	// Conflict responder
	response.conflictResponder = (error) =>
		fail('Conflict: ' + JSON.stringify(error));

	// Delete responder
	response.deleteResponder = (result) =>
		fail('Delete: ' + JSON.stringify(result));

	// Forbidden responder
	response.forbiddenResponder = (error) =>
		fail('Forbidden: ' + JSON.stringify(error));

	// Get responder
	response.getResponder = (result) => fail('Get: ' + JSON.stringify(result));

	// Error responder
	response.error = (error) => fail('Error: ' + JSON.stringify(error));

	// Gone responder
	response.goneResponder = (error) => fail('Gone: ' + JSON.stringify(error));

	// Post responder
	response.postResponder = (result) =>
		fail('Post: ' + JSON.stringify(result));

	// Patch responder
	response.patchResponder = (result) =>
		fail('Patch: ' + JSON.stringify(result));

	// Unauthorized responder
	response.unauthorizedResponder = (error) =>
		fail('Unauthorized: ' + JSON.stringify(error));

	// Validation responder
	response.validationResponder = (error) =>
		fail('Validation: ' + JSON.stringify(error));

	// Return request/response
	return { request, response };
}
