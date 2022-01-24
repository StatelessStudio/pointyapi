import { setupErrorHandling } from 'ts-error-handler';
import { log } from './log';

/**
 * Global error handler for uncaught exceptions
 *
 * @param e
 */
export function errorHandler(error: Error): void {
	log.fatal(error);
}

// Setup error handling
setupErrorHandling({
	handler: errorHandler
});
