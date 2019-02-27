/**
 * Create a timestamp for the current time
 * @return Returns the timestamp
 */
export function createTimestamp(): string {
	// Create a date object with the current time
	const now = new Date();

	// Create an array with the current month, day and time
	const date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

	// Create an array with the current hour, minute and second
	const time: any = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

	// Return the formatted string
	return '[' + date.join('/') + ' ' + time.join(':') + ']';
}
