import { createTimestamp } from './create-timestamp';

export function logHandler(message: string, data: any = false) {
	console.log('[SERVER]', createTimestamp(), message);

	if (data) {
		console.log(data);
	}
}
