import { setupErrorHandling } from 'ts-error-handler';
import { app } from './bootstrap';
import { log } from './log';

/**
 * Global error handler for uncaught exceptions
 *
 * @param e
 */
export function errorHandler(error: Error): void {
	log.fatal(error.toString(), error);

	app.exit();
}

// Setup error handling
setupErrorHandling({
	handler: errorHandler,
	// TODO: includeJsFiles and justMyCode options can be removed after
	//	ts-error-handler#8 is closed
	//	https://github.com/StatelessStudio/ts-error-handler/issues/8
	includeJsFiles: true,
	justMyCode: false,
});
