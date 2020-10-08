declare var console;

export class Logger
{
	public info: Function = console.log;
	public debug: Function = (...args) => {};
	public warn: Function = console.log;
	public error: Function = console.error;

	public constructor(debug?)
	{
		if (debug) {
			debug = logger.info;
		}
	}
};

export const logger: Logger = new Logger();
