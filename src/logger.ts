/* eslint-disable no-console */

export class Logger {
	public info: (...args) => void = console.log;
	public debug: (...args) => void = () => {};
	public warn: (...args) => void = console.log;
	public error: (...args) => void = console.error;

	public constructor(_debug?: boolean) {
		if (_debug) {
			this.debug = this.info;
		}
	}
}

export const logger: Logger = new Logger();
