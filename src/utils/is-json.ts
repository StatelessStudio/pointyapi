/**
 * Check if a string is valid JSON
 * @param str String to check
 * @return Returns if the string is valid JSON
 */
export function isJson(str: string): boolean {
	if (!str || !str.indexOf) {
		return false;
	}

	if (str.indexOf('{') !== 0 && str.indexOf('{') !== 0) {
		return false;
	}

	try {
		JSON.parse(str);
	}
	catch (e) {
		return false;
	}
	return true;
}
