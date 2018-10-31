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

export function isJson(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

export class HttpClientResponse {
	public statusCode: number;
	public response: Request.Response;
	public body: Request.Response;

	constructor(response: any, body: any) {
		this.statusCode = response.statusCode;
		this.response = response;
		this.body = isJson(body) ? JSON.parse(body) : body;
	}
}
