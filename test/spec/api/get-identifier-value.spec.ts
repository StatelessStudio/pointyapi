import { mockRequest } from 'mock-req-res';
import { getIdentifierValue } from '../../../src';

/**
 * getIdentifierValue()
 * pointyapi/
 */
describe('getIdentifierValue', () => {
	/**
	 * Get a value from a request
	 */
	it('gets a value from a request w/o identifier', () => {
		// Create mock request
		const request = mockRequest();
		request.params = {
			id: 1
		};
		request.baseUrl = '/api/v1/user';

		// Expect request query id to equal 1
		expect(getIdentifierValue(request)).toEqual(1);
	});

	/**
	 * Get a value from a request with an explicity set identifier
	 */
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
