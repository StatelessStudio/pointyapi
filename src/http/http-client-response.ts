/**
 * # HttpClientResponse
 *
 * HttpClient requests return an object:
 *
 * - statusCode - The response status code
 * - response - The entire response object
 * - body - The JSON.parsed response body
 */

/**
 * HttpClientResponse
 */

import Request = require('request');

/**
 * Check if a string is valid JSON
 * @param str string String to check
 * @return boolean
 */
export function isJson(str: string): boolean {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

/**
 * HTTP Mock Client Response
 */
export class HttpClientResponse {
	// Response status code
	public statusCode: number;

	// Response object
	public response: Request.Response;

	// Response body
	public body: Request.Response;

	/**
	 * Create a mock http response
	 * @param response Response response object
	 * @param body Response body
	 */
	constructor(response: any, body: any) {
		this.statusCode = response ? response.statusCode : undefined;
		this.response = response;
		this.body = isJson(body) ? JSON.parse(body) : body;
	}
}
