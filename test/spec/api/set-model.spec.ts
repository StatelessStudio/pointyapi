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

	it('sets the query', async () => {
		const request = mockRequest();
		const response = mockResponse();

		request.query = { id: 1 };

		await setModel(request, response, BaseUser);

		expect(request.query).toEqual(jasmine.any(BaseUser));
	});

	it('sets the body', async () => {
		const request = mockRequest();
		const response = mockResponse();

		request.body = { id: 1 };

		await setModel(request, response, BaseUser);

		expect(request.body).toEqual(jasmine.any(BaseUser));
	});
});
