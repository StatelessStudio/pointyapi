import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { runHook } from '../utils/run-hook';
import { readFilter } from '../bodyguard/read-filter';
import { deleteUndefinedMembers } from '../utils';

/**
 * Post endpoint
 */
export async function postEndpoint(
	request: Request,
	response: Response
): Promise<void> {
	if (request.body instanceof Array) {
		for (let i = 0; i < request.body.length; i++) {
			// Set model type
			request.body[i] = Object.assign(
				new request.payloadType(),
				request.body[i]
			);

			// Delete undefined members
			request.body[i] = deleteUndefinedMembers(request.body[i]);
		}

		// Run model hooks
		if (!await runHook('post', request.body, request, response)) {
			return;
		}

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
			// Save
			const repo = await request.repository;

			// TODO: Replace with Promise.all for async posts
			let results = [];
			for (let i = 0; i < request.body.length; i++) {
				results.push(
					await repo
						.save(request.body[i])
						.catch((error) => response.error(error))
				);
			}

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
		// Set model type
		request.body = Object.assign(new request.payloadType(), request.body);

		// Delete undefined members
		request.body = deleteUndefinedMembers(request.body);

		// Run model hook
		if (!await runHook('post', request.body, request, response)) {
			return;
		}

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
