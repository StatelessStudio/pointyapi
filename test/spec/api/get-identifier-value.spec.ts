import { mockRequest } from 'mock-req-res';
import { getIdentifierValue } from '../../../src';

describe('getIdentifierValue', () => {
	it('gets a value from a request with identifier', () => {
		const request = mockRequest();
		request.params = {
			username: 'tom'
		};
		request.identifier = 'username';
		request.baseUrl = '/api/v1/user';

		expect(getIdentifierValue(request)).toEqual('tom');
	});

	it('gets a value from a request w/o identifier', () => {
		const request = mockRequest();
		request.params = {
			id: 1
		};
		request.baseUrl = '/api/v1/user';

		expect(getIdentifierValue(request)).toEqual(1);
	});
});
