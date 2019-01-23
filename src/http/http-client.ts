/**
 * # HttpClient
 *
 * HttpClient can be used to mock requests in your test-suite.  There are
 * 4 functions: post(), get(), put(), delete()
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
	public port = process.env.PORT;

	/**
	 * Send a POST http request to the server
	 * @param path string Path to send to (e.g. /users)
	 * @param data object Data to send as query
	 * @param expect number[] Array of status codes to expect
	 * @param bearer string (Optional) Bearer token to send
	 */
	public post(
		path: string,
		data: object,
		expect: number[] = [ 200 ],
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
	 * @param path string Path to send to (e.g. /users)
	 * @param data object Data to send as query
	 * @param expect number[] Array of status codes to expect
	 * @param bearer string (Optional) Bearer token to send
	 */
	public get(
		path: string,
		data: boolean | Object = false,
		expect: number[] = [ 200 ],
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
	 * Send a PUT http request to the server
	 * @param path string Path to send to (e.g. /users)
	 * @param data object Data to send as query
	 * @param expect number[] Array of status codes to expect
	 * @param bearer string (Optional) Bearer token to send
	 */
	public put(
		path: string,
		data: object,
		expect: number[] = [ 204 ],
		bearer: boolean | string = false
	): Promise<HttpClientResponse> {
		const options = {
			method: 'PUT',
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
	 * @param path string Path to send to (e.g. /users)
	 * @param data object Data to send as query
	 * @param expect number[] Array of status codes to expect
	 * @param bearer string (Optional) Bearer token to send
	 */
	public delete(
		path: string,
		expect: number[] = [ 204 ],
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
