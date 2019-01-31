import { mockRequest, mockResponse } from 'mock-req-res';

import { setModel } from '../../../src';
import { BaseUser } from '../../../src/models';

/**
 * setModel()
 * pointyapi/
 */
describe('setModel', () => {
	it('sets the payload', async () => {
		// Create request
		const request = mockRequest();
		request.baseUrl = '/api/v1/user';

		// Create response
		const response = mockResponse();

		// Set model
		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		// Expect payload to be a User
		expect(request.payload).toEqual(jasmine.any(BaseUser));
	});

	it('sets the identifier', async () => {
		// Create request
		const request = mockRequest();
		request.baseUrl = '/api/v1/user';

		// Create response
		const response = mockResponse();

		// Set model
		if (!await setModel(request, response, BaseUser, false, 'username')) {
			fail('Could not set model');
		}

		// Expect identifier to have been set
		expect(request.identifier).toEqual('username');
	});
});
