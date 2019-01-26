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
