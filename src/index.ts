/**
 * This file is the main entrypoint for your application.
 */
import { bootstrap } from './bootstrap';
import { main } from './main';

/**
 * Bootstrap the application
 */
bootstrap(main);

/**
 * Documentation - Exported modules will appear in documentation
 */
export { bootstrap } from './bootstrap';
export { Environment } from './environment';
export { errorHandler } from './error-handler';
