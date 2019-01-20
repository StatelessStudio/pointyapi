import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { runHook } from '../run-hook';
import { responseFilter } from '../bodyguard/response-filter';

function setModelType(type, obj) {
	return Object.assign(new type(), obj);
}

function deleteUndefinedMembers(obj) {
	for (const key in obj) {
		if (obj[key] === undefined) {
			delete obj[key];
		}
	}

	return obj;
}

export async function postEndpoint(request: Request, response: Response) {
	if (request.body instanceof Array) {
		let shouldSave = true;

		for (let i = 0; i < request.body.length; i++) {
			// Set model type
			request.body[i] = setModelType(
				request.payloadType,
				request.body[i]
			);

			// Delete undefined members
			request.body[i] = deleteUndefinedMembers(request.body[i]);

			// Run model hook
			if (!await runHook(request, response, 'post', request.body[i])) {
				return;
			}

			// Validate
			const errors = await validate(request.body[i]).catch((error) =>
				response.error(error)
			);

			// Check
			if (errors && errors.length) {
				response.validationResponder(errors);
				shouldSave = false;
				return;
			}
		}

		if (shouldSave && request.body.length) {
			// Send
			const repo = await request.repository;

			let results = [];
			for (let i = 0; i < request.body.length; i++) {
				results.push(
					await repo
						.save(request.body[i])
						.catch((error) => response.error(error))
				);
			}

			if (results) {
				results = responseFilter(
					results,
					request.user,
					request.payloadType,
					request.userType,
					request.joinMembers
				);

				response.postResponder(results);
			}
		}
	}
	else {
		// Set model type
		request.body = setModelType(request.payloadType, request.body);

		// Delete undefined members
		request.body = deleteUndefinedMembers(request.body);

		// Run model hook
		if (!await runHook(request, response, 'post', request.body)) {
			return;
		}

		// Validate
		const errors = await validate(request.body).catch((error) =>
			response.error(error)
		);

		// Check
		if (errors && errors.length) {
			response.validationResponder(errors);
		}
		else {
			// Send
			await request.repository
				.save(request.body)
				.then((result) => {
					result = responseFilter(
						result,
						request.user,
						request.payloadType,
						request.userType,
						request.joinMembers
					);

					response.postResponder(result);
				})
				.catch((error) => response.error(error));
		}
	}
}
