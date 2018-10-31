/**
 * # Get Identifier Value
 *
 * Get's the ID parameter from the URL, e.g. the 12 in `localhost/user/12`.
 */

/**
 * getIdentifierValue()
 */
import { Request } from 'express';

export function getIdentifierValue(request: Request) {
	return request.params[request.identifier || 'id'];
}
