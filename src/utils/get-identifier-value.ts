/**
 * # Get Identifier Value
 *
 * Get's the ID parameter from the URL, e.g. the 12 in `localhost/user/12`.
 */

/**
 * getIdentifierValue()
 */
import { Request } from 'express';

/**
 * Get parameter ID from URL
 * @param request Express::Request Request to check URL from
 */
export function getIdentifierValue(request: Request): any {
	return request.params[request.identifier || 'id'];
}
