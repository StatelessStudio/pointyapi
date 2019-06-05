/**
 * # HttpClient
 *
 * HttpClient can be used to mock requests in your test-suite.  There are
 * 4 functions: post(), get(), patch(), delete()
 *
 * **Before using, set HttpClient.url and HttpClient.port**
 *
 */

/**
 * HttpClient
 */

import * as request from 'request';
import { HttpClientResponse } from './http-client-response';

export class HttpClient {
	// Server URL
	public url = 'http://localhost';

	// Server PORT
	public port: number | string = process.env.PORT;

	/**
	 * Send a POST http request to the server
	 * @param path Path to send to (e.g. /users)
	 * @param data Data to send as query
	 * @param expect Array of status codes to expect
	 * @param bearer Bearer token to send
	 * @return Returns a promise of HttpClientResponse
	 */
	public post(
		path: string,
		data: object,
		expect: number[] = [ 200, 201, 202, 204 ],
		bearer: boolean | string = false
	): Promise<HttpClientResponse> {
		const options = {
			method: 'POST',
			url: `${this.url}:${this.port}${path}`,
			body: data,
			json: true
		};

		if (bearer) {
			options['auth'] = { bearer: `${bearer}` };
		}

		return new Promise<HttpClientResponse>((accept, reject) => {
			request(options, (error, response, body) => {
				if (error) {
					reject(new HttpClientResponse(response, error));
				}
				else if (response) {
					if (expect.includes(response.statusCode)) {
						accept(new HttpClientResponse(response, body));
					}
					else {
						reject(new HttpClientResponse(response, error));
					}
				}
				else {
					reject(new HttpClientResponse(response, 'No response'));
				}
			});
		});
	}

	/**
	 * Send a GET http request to the server
	 * @param path Path to send to (e.g. /users)
	 * @param data Data to send as query
	 * @param expect Array of status codes to expect
	 * @param bearer Bearer token to send
	 * @return Returns a promise of HttpClientResponse
	 */
	public get(
		path: string,
		data: boolean | Object = false,
		expect: number[] = [ 200, 202 ],
		bearer: boolean | string = false
	): Promise<HttpClientResponse> {
		return new Promise<HttpClientResponse>((accept, reject) => {
			const options = {
				method: 'GET',
				url: `${this.url}:${this.port}${path}`,
				json: true,
				qs: data
			};

			if (bearer) {
				options['auth'] = { bearer: `${bearer}` };
			}

			request(options, (error, response, body) => {
				if (error) {
					reject(new HttpClientResponse(response, error));
				}
				else if (response) {
					if (expect.includes(response.statusCode)) {
						accept(new HttpClientResponse(response, body));
					}
					else {
						reject(new HttpClientResponse(response, error));
					}
				}
				else {
					reject(new HttpClientResponse(response, 'No response'));
				}
			});
		});
	}

	/**
	 * Send a PATCH http request to the server
	 * @param path Path to send to (e.g. /users)
	 * @param data Data to send as query
	 * @param expect Array of status codes to expect
	 * @param bearer Bearer token to send
	 * @return Returns a promise of HttpClientResponse
	 */
	public patch(
		path: string,
		data: object,
		expect: number[] = [ 200, 201, 202, 204 ],
		bearer: boolean | string = false
	): Promise<HttpClientResponse> {
		const options = {
			method: 'PATCH',
			url: `${this.url}:${this.port}${path}`,
			body: data,
			json: true
		};

		if (bearer) {
			options['auth'] = { bearer: `${bearer}` };
		}

		return new Promise<HttpClientResponse>((accept, reject) => {
			request(options, (error, response, body) => {
				if (error) {
					reject(new HttpClientResponse(response, error));
				}
				else if (response) {
					if (expect.includes(response.statusCode)) {
						accept(new HttpClientResponse(response, body));
					}
					else {
						reject(new HttpClientResponse(response, error));
					}
				}
				else {
					reject(new HttpClientResponse(response, 'No response'));
				}
			});
		});
	}

	/**
	 * Send a DELETE http request to the server
	 * @param path Path to send to (e.g. /users)
	 * @param data Data to send as query
	 * @param expect Array of status codes to expect
	 * @param bearer Bearer token to send
	 * @return Returns a promise of HttpClientResponse
	 */
	public delete(
		path: string,
		expect: number[] = [ 200, 202, 204 ],
		bearer: boolean | string = false
	): Promise<HttpClientResponse> {
		return new Promise<HttpClientResponse>((accept, reject) => {
			const options = {
				method: 'DELETE',
				url: `${this.url}:${this.port}${path}`
			};

			if (bearer) {
				options['auth'] = { bearer: `${bearer}` };
			}

			request(options, (error, response, body) => {
				if (error) {
					reject(new HttpClientResponse(response, error));
				}
				else if (response) {
					if (expect.includes(response.statusCode)) {
						accept(new HttpClientResponse(response, body));
					}
					else {
						reject(new HttpClientResponse(response, error));
					}
				}
				else {
					reject(new HttpClientResponse(response, 'No response'));
				}
			});
		});
	}
}
