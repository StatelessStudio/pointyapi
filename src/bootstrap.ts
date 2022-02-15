/**
 * This file bootstraps your application by running the register function
 * 	and setting up error handling.
 */
import {
	bootstrap as _bootstrap,
	BootstrapFunction,
	BootstrapOptions
} from 'ts-async-bootstrap';

import { errorHandler } from './error-handler';
import { register } from './register';

/**
 * Default bootstrapping options
 */
export const defaultBootstrapOptions: Partial<BootstrapOptions> = {
	register: register,
	errorHandler: errorHandler,
	shouldExitOnError: true,
};

/**
 * Bootstrap a function
 */
export function bootstrap(
	run: BootstrapFunction,
	options?: Partial<BootstrapOptions>
): void {
	_bootstrap({
		...defaultBootstrapOptions,
		...options,
		run: run
	});
}
