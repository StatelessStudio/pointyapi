import { mockRequest, mockResponse } from 'mock-req-res';

import { setModel } from '../../../src';
import { BaseUser } from '../../../src/models';

describe('setModel', () => {
	it('sets the payload', async () => {
		const request = mockRequest();
		const response = mockResponse();

		await setModel(request, response, BaseUser);
		expect(request.payload).toEqual(jasmine.any(BaseUser));
	});

	it('sets the identifier', async () => {
		const request = mockRequest();
		const response = mockResponse();

		await setModel(request, response, BaseUser, 'username');

		expect(request.identifier).toEqual('username');
	});
});
