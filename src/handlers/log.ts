import { createTimestamp } from './create-timestamp';

/**
 * Default log handler
 * @param message string Message string to log
 * @param data any Message data to log
 */
export function logHandler(message: string, data: any = false): void {
	console.log('[SERVER]', createTimestamp(), message);

	if (data) {
		console.log(data);
	}
}
