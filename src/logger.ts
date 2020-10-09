declare var console;

export class Logger
{
	public info: Function = console.log;
	public debug: Function = (...args) => {};
	public warn: Function = console.log;
	public error: Function = console.error;

	public constructor(_debug?)
	{
		if (_debug) {
			this.debug = this.info;
		}
	}
};

export const logger: Logger = new Logger();
