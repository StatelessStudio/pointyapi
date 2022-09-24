/**
 * # HttpClient
 *
 * HttpClient can be used to mock requests in your test-suite. There are
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
	public request = request;

	// Server URL
	public url = 'http://localhost';

	// Server PORT
	public port: number | string = process.env.PORT;

	// Global headers
	public headers?: Object;

	/**
	 * Send a POST http request to the server
	 * @param path Path to send to (e.g. /users)
	 * @param data Data to send as query
	 * @param bearer Bearer token to send
	 * @param expect Array of status codes to expect
	 * @param customOptions Additional request options
	 * @return Returns a promise of HttpClientResponse
	 */
	public async post(
		path: string,
		data: object,
		bearer: boolean | string = false,
		expect: number[] = [ 200, 201, 202, 204 ],
		customOptions?: object
	): Promise<HttpClientResponse> {
		let options = {
			method: 'POST',
			url: `${this.url}:${this.port}${path}`,
			body: data,
			json: true
		};

		if (bearer) {
			options['auth'] = { bearer: `${bearer}` };
		}

		if (this.headers) {
			options['headers'] = this.headers;
		}

		if (customOptions) {
			options = Object.assign(options, customOptions);
		}

		return new Promise<HttpClientResponse>((accept, reject) => {
			this.request(options, (error, response, body) => {
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
	 * @param bearer Bearer token to send
	 * @param expect Array of status codes to expect
	 * @param customOptions Additional request options
	 * @return Returns a promise of HttpClientResponse
	 */
	public async get(
		path: string,
		data: boolean | Object = false,
		bearer: boolean | string = false,
		expect: number[] = [ 200, 202 ],
		customOptions?: object
	): Promise<HttpClientResponse> {
		return new Promise<HttpClientResponse>((accept, reject) => {
			let options = {
				method: 'GET',
				url: `${this.url}:${this.port}${path}`,
				json: true,
				qs: data
			};

			if (bearer) {
				options['auth'] = { bearer: `${bearer}` };
			}

			if (this.headers) {
				options['headers'] = this.headers;
			}

			if (customOptions) {
				options = Object.assign(options, customOptions);
			}

			this.request(options, (error, response, body) => {
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
	 * @param bearer Bearer token to send
	 * @param expect Array of status codes to expect
	 * @param customOptions Additional request options
	 * @return Returns a promise of HttpClientResponse
	 */
	public async patch(
		path: string,
		data: object,
		bearer: boolean | string = false,
		expect: number[] = [ 200, 201, 202, 204 ],
		customOptions?: object
	): Promise<HttpClientResponse> {
		let options = {
			method: 'PATCH',
			url: `${this.url}:${this.port}${path}`,
			body: data,
			json: true
		};

		if (bearer) {
			options['auth'] = { bearer: `${bearer}` };
		}

		if (this.headers) {
			options['headers'] = this.headers;
		}

		if (customOptions) {
			options = Object.assign(options, customOptions);
		}

		return new Promise<HttpClientResponse>((accept, reject) => {
			this.request(options, (error, response, body) => {
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
	 * @param bearer Bearer token to send
	 * @param expect Array of status codes to expect
	 * @param customOptions Additional request options
	 * @return Returns a promise of HttpClientResponse
	 */
	public async delete (
		path: string,
		bearer: boolean | string = false,
		expect: number[] = [ 200, 202, 204 ],
		customOptions?: object
	): Promise<HttpClientResponse> {
		return new Promise<HttpClientResponse>((accept, reject) => {
			let options = {
				method: 'DELETE',
				url: `${this.url}:${this.port}${path}`
			};

			if (bearer) {
				options['auth'] = { bearer: `${bearer}` };
			}

			if (this.headers) {
				options['headers'] = this.headers;
			}

			if (customOptions) {
				options = Object.assign(options, customOptions);
			}

			this.request(options, (error, response, body) => {
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
