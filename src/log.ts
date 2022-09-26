import { Log } from 'ts-tiny-log';

/**
 * You can replace or extend the log, but it should implement LogInterface
 * 	from ts-tiny-log
 */
export let log: Log = new Log({
});

/**
 * Set the log to a new instance
 *
 * @param _log Log instance
 */
export function setLog(_log: Log): void {
	log = _log;
}
