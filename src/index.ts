/**
 * This file is the main entrypoint for your application. It just runs the
 * 	register function (read the readme), and then runs the main function.
 *
 * You should typically avoid changing this file if you don't have to, to
 * 	avoid merge conflicts with the template.
 */
import { bootstrap } from 'ts-async-bootstrap';
import { main } from './main';
import { register } from './register';

/**
 * Bootstrap the application
 */
bootstrap({
	register: register,
	run: main,
	shouldExit: true
});
