/**
 * Check if a string is valid JSON
 * @param str String to check
 * @return Returns if the string is valid JSON
 */
export function isJson(str: string): boolean {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
