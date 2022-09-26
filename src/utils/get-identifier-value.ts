/**
 * # Get Identifier Value
 *
 * Get's the ID parameter from the URL, e.g. the 12 in `localhost/user/12`.
 */

/**
 * getIdentifierValue()
 */
import { Request } from '../index';

/**
 * Get parameter ID from URL
 * @param request Express request to check URL from
 * @return Returns the value of the identifier
 */
export function getIdentifierValue(request: Request): any {
	return request.params[request.identifier || 'id'];
}
