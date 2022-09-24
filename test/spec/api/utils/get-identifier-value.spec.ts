import 'jasmine';
import { mockRequest } from 'mock-req-res';
import { getIdentifierValue } from '../../../../src/utils';

/**
 * getIdentifierValue()
 * pointyapi/
 */
describe('getIdentifierValue', () => {
	it('gets a value from a request without identifier', () => {
		// Create mock request
		const request = mockRequest();
		request.params = {
			id: 1
		};
		request.baseUrl = '/api/v1/user';

		// Expect request query id to equal 1
		expect(getIdentifierValue(request)).toEqual(1);
	});

	it('gets a value from a request with identifier', () => {
		// Create request
		const request = mockRequest();
		request.params = {
			username: 'tom'
		};
		request.identifier = 'username';
		request.baseUrl = '/api/v1/user';

		// Expect request query username to equal "tom"
		expect(getIdentifierValue(request)).toEqual('tom');
	});
});
