/**
 * Convert string/buffer to string
 *
 * @param str Input string/buffer
 * @returns Returns the string
 */
function toString(str: any): any {
	if (str instanceof Buffer) {
		return str.toString();
	}

	return str;
}

/**
 * Bootstrap a script
 *
 * @param returned The script returned promise
 */
export function bootstrap(returned: Promise<any>): void {
	returned
		.then(returned => {
			if (returned !== undefined) {
				console.log(toString(returned));
			}
		})
		.catch(error => {
			console.error('ERROR: ', toString(error));
			process.exit(error?.code ? error.code : 1);
		});
}
