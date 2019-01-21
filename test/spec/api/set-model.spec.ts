import { mockRequest, mockResponse } from 'mock-req-res';

import { setModel } from '../../../src';
import { BaseUser } from '../../../src/models';

describe('setModel', () => {
	it('sets the payload', async () => {
		const request = mockRequest();
		request.baseUrl = '/api/v1/user';

		const response = mockResponse();

		if (!await setModel(request, response, BaseUser)) {
			fail('Could not set model');
		}

		expect(request.payload).toEqual(jasmine.any(BaseUser));
	});

	it('sets the identifier', async () => {
		const request = mockRequest();
		request.baseUrl = '/api/v1/user';

		const response = mockResponse();

		if (!await setModel(request, response, BaseUser, 'username')) {
			fail('Could not set model');
		}

		expect(request.identifier).toEqual('username');
	});
});
