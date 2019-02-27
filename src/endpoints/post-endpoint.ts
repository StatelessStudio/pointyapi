import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { runHook } from '../utils/run-hook';
import { readFilter } from '../bodyguard/read-filter';

/**
 * Post endpoint
 * @param request Request object to query by
 * @param response Response object to call responder with
 */
export async function postEndpoint(
	request: Request,
	response: Response
): Promise<void> {
	// Run model hook
	if (!await runHook('post', request.body, request, response)) {
		return;
	}

	if (request.body instanceof Array) {
		for (let i = 0; i < request.body.length; i++) {
			// Validate
			const errors = await validate(request.body[i]).catch((error) =>
				response.error(error)
			);

			// Check
			if (errors && errors.length) {
				response.validationResponder(errors);
				return;
			}
		}

		if (request.body.length) {
			// Get repo
			const repo = await request.repository;

			// Get array of promises
			const promises = [];
			for (let i = 0; i < request.body.length; i++) {
				promises.push(
					repo
						.save(request.body[i])
						.catch((error) => response.error(error))
				);
			}

			let results = await Promise.all(promises);

			// Create result
			if (results) {
				results = readFilter(
					results,
					request.user,
					request.payloadType,
					request.userType
				);

				// Send result
				response.postResponder(results);
			}
		}
	}
	else {
		// Validate
		const errors = await validate(request.body).catch((error) =>
			response.error(error)
		);

		// Check
		if (errors && errors.length) {
			// Validation erros; respond with 400 Bad Request
			response.validationResponder(errors);
		}
		else {
			// Save
			await request.repository
				.save(request.body)
				.then((result) => {
					// Create response
					result = readFilter(
						result,
						request.user,
						request.payloadType,
						request.userType
					);

					// Send response and 200 Success
					response.postResponder(result);
				})
				.catch((error) => response.error(error));
		}
	}
}
