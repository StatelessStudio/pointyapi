import { Request, Response } from 'express';
import { isKeyInModel } from '../utils';
import { queryTypes, queryTypeKeys } from './query-types';
import { getReadableFields, getReadableRelations } from '../bodyguard';
import { validateSync } from 'class-validator';
import { getValidationConstraints } from './get-validation-constraints';
import { Query } from './query';

/**
 * Validate a GET query type
 * @param type Query type name
 * @param request Express request
 * @param response Express response
 * @return Returns if the currrent query type is valid
 */
function queryFieldValidator(
	type: string,
	request: Request,
	response: Response
): boolean {
	const readableKeys = getReadableFields(
		new request.payloadType(),
		request.user
	);

	const readableRelations = getReadableRelations(
		new request.payloadType(),
		request.user
	);

	const requestQueryParams: Query = request.query;

	if (type in requestQueryParams) {
		if (requestQueryParams[type] instanceof Array) {
			for (let i = 0; i < requestQueryParams[type].length; i++) {
				const key = requestQueryParams[type][i];

				if (key === undefined) {
					requestQueryParams[type].splice(i, 1);

					continue;
				}

				if (!isKeyInModel(key, request.payload, response)) {
					response.validationResponder(
						'Member "' + key + '" does not exist in model'
					);

					return false;
				}

				if (
					!readableKeys.includes(key) &&
					!readableRelations.includes(
						key && key.indexOf('.') ? key.split('.')[0] : key
					)
				) {
					response.forbiddenResponder(
						'Cannot "' + type + '" by member "' + key + '"'
					);

					return false;
				}
			}
		}
		else if (requestQueryParams[type] instanceof Object) {
			const validators = getValidationConstraints(request.payloadType);

			for (const key in requestQueryParams[type]) {
				const value = requestQueryParams[type][key];

				if (value === undefined) {
					delete requestQueryParams[type][key];

					continue;
				}

				if (!isKeyInModel(key, request.payload, response)) {
					response.validationResponder(
						'Member "' + key + '" does not exist in model'
					);

					return false;
				}

				if (
					!readableKeys.includes(key) &&
					!readableRelations.includes(
						key && key.indexOf('.') ? key.split('.')[0] : key
					)
				) {
					response.forbiddenResponder(
						'Cannot "' + type + '" by member "' + key + '"'
					);

					return false;
				}

				// Cast to int if need be
				if (
					key in validators &&
					'isInt' in validators[key] &&
					validators[key]['isInt'] === true
				) {
					if (Array.isArray(value)) {
						for (let i = 0; i < value.length; i++) {
							const asInt = parseInt(value[i], 10);

							if (!isNaN(asInt)) {
								value[i] = asInt;
							}
						}
					}
					else {
						const asInt = parseInt(value, 10);

						if (!isNaN(asInt)) {
							requestQueryParams[type][key] = asInt;
						}
					}
				}
			}

			if (
				type === 'where' ||
				type === 'whereAnyOf' ||
				type === 'not' ||
				type === 'lessThan' ||
				type === 'lessThanOrEqual' ||
				type === 'greaterThan' ||
				type === 'greaterThanOrEqual'
			) {
				const testObject = Object.assign(
					new request.payloadType(),
					requestQueryParams[type]
				);

				const validationErrors = validateSync(testObject, {
					skipMissingProperties: true
				});
				if (validationErrors && validationErrors.length) {
					response.validationResponder(validationErrors);

					return false;
				}
			}
		}
		else if (type === 'id') {
			const validator = getValidationConstraints(
				request.payloadType,
				'id'
			);

			if (validator && 'isInt' in validator && validator.isInt === true) {
				const asInt = parseInt(`${requestQueryParams.id}`, 10);

				if (!isNaN(asInt)) {
					requestQueryParams.id = asInt;
				}
			}

			const testObject = Object.assign(new request.payloadType(), {
				id: requestQueryParams[type]
			});

			const validationErrors = validateSync(testObject, {
				skipMissingProperties: true
			});

			if (validationErrors && validationErrors.length) {
				response.validationResponder(validationErrors);

				return false;
			}
		}
	}

	return true;
}

/**
 * Validate a GET query
 * @param request Express::Request Express request
 * @param response Express::Response Express response
 * @return Returns if the get query is valid
 */
export function queryValidator(request: Request, response: Response): boolean {
	const requestQueryParams: Query = request.query;

	for (const type in requestQueryParams) {
		// Is this defined?
		if (requestQueryParams[type] === undefined) {
			delete requestQueryParams[type];

			continue;
		}

		// Is query type registered?
		if (!queryTypeKeys.includes(type)) {
			if (response) {
				response.validationResponder(
					'Query type "' + type + '" is not a valid query type.'
				);
			}

			return false;
		}

		// Is query type proper (array, object, etc)?
		let queryTypeConstructor: string = typeof requestQueryParams[type];

		if (
			queryTypeConstructor === 'object' &&
			'length' in requestQueryParams[type]
		) {
			queryTypeConstructor = 'array';
		}

		if (!queryTypes[type].includes(queryTypeConstructor)) {
			if (response) {
				response.validationResponder(
					'Query type "' +
						type +
						'" should be one of: [' +
						queryTypes[type].join() +
						']. It is: ' +
						queryTypeConstructor +
						'. Value: ' +
						requestQueryParams[type]
				);
			}

			return false;
		}

		// Is current query valid?
		if (
			type !== 'additionalParameters' &&
			!queryFieldValidator(type, request, response)
		) {
			return false;
		}
	}

	return true;
}
