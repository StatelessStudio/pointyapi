import { exec as childProcExec } from 'child_process';

/**
 * Execute a command
 * 
 * @param cmd Command to execute
 * @param silent (Optional) Set to true to output command output
 * @returns Returns the command output
 */
export function exec(cmd: string, silent = false): Promise<any>
{
	return new Promise((a, r) => {
		console.log('p> ' + cmd);

		childProcExec(cmd, (err, stdout, stderr) => {
			if (!silent) {
				if (stdout) {
					console.log(stdout);
				}

				if (stderr) {
					console.error(stderr);
				}
			}

			if (err) {
				r(err);
			}
			else {
				a(stdout);
			}
		});
	});
}
