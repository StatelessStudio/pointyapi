/**
 * # HttpClient
 *
 * HttpClient can be used to mock requests in your test-suite.  There are
 * 4 functions: post(), get(), put(), delete()
 *
 * **Before using, set HttpClient.url and HttpClient.port**
 *
 * Each function takes up to 4 parameters:
 * - path: string
 *
 * 	The path URL path to connect to
 *
 * - data: object (NOT ON DELETE)
 *
 *  Data as query/body to pass with the request
 *
 * - expect: number[] = [ 200 ]
 *
 *  Pass an array of status codes that you expect the endpoint to respond with.
 *  The promise will be rejected if the response status-code is not expected
 *
 * - bearer: bool | string = false
 *
 *  JWT Bearer token to pass with the request
 *
 */

/**
 * HttpClient
 */

import * as request from 'request';
import { HttpClientResponse } from './http-client-response';

export class HttpClient {
	public url = 'http://localhost';
	public port = process.env.PORT;

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
				else {
					if (expect.includes(response.statusCode)) {
						accept(new HttpClientResponse(response, body));
					}
					else {
						reject(new HttpClientResponse(response, error));
					}
				}
			});
		});
	}

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
				else {
					if (expect.includes(response.statusCode)) {
						accept(new HttpClientResponse(response, body));
					}
					else {
						reject(new HttpClientResponse(response, error));
					}
				}
			});
		});
	}

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
				else {
					if (expect.includes(response.statusCode)) {
						accept(new HttpClientResponse(response, body));
					}
					else {
						reject(new HttpClientResponse(response, error));
					}
				}
			});
		});
	}

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
				else {
					if (expect.includes(response.statusCode)) {
						accept(new HttpClientResponse(response, body));
					}
					else {
						reject(new HttpClientResponse(response, error));
					}
				}
			});
		});
	}
}
