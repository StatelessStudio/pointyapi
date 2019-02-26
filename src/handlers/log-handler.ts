import { createTimestamp } from '../utils/create-timestamp';

/**
 * Default log handler
 * @param message Message string to log
 * @param data Message data to log
 */
export function logHandler(message: string, data: any = false): void {
	console.log('[SERVER]', createTimestamp(), message);

	if (data) {
		console.log(data);
	}
}
