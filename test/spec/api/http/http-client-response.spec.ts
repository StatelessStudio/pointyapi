import { HttpClientResponse } from '../../../../src/http/http-client-response';

/**
 * HTTP Client Response
 * pointyapi/http
 */
describe('[HTTP] HTTP Client Response', () => {
	it('sets the status code', () => {
		const httpResponse = new HttpClientResponse(
			{
				statusCode: 200
			},
			{}
		);

		expect(httpResponse.statusCode).toEqual(200);
	});

	it('sets the body', () => {
		const httpResponse = new HttpClientResponse(
			{ statusCode: 200 },
			{ message: 'hello' }
		);

		expect(httpResponse.body['message']).toEqual('hello');
	});
});
