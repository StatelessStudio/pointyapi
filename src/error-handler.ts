import { setupErrorHandling } from 'ts-error-handler';
import { logger } from './logger';

/**
 * Global error handler for uncaught exceptions
 *
 * @param e
 */
export function errorHandler(error: Error) {
	logger.fatal(error);
}

// Setup error handling
setupErrorHandling({
	handler: errorHandler
});
