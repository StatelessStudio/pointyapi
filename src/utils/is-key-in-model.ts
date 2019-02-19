import { Response } from 'express';

/**
 * Check if the key is in the model, and not a PointyAPI special
 * 	key (`__keyname`)
 * @param key string Key name
 * @param model any Model to check
 * @param response Express::Response (Optional) Response object to
 * 	respond with a 400
 */
export function isKeyInModel(
	key: string,
	model: any,
	response?: Response
): boolean {
	if (key.includes('.')) {
		key = key.split('.')[0];
	}

	if (!(key in model) && key.indexOf('__') !== 0) {
		if (response) {
			response.validationResponder(
				'Member key "' + key + '" does not exist in model.'
			);
		}

		return false;
	}
	else {
		return true;
	}
}
