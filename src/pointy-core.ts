// Express
const express = require('express');
import { Response, Request, NextFunction, Application } from 'express';
import * as bodyParser from 'body-parser';

// Pointy Core
import { listen } from './utils/listen';
import { BaseDb, PointyPostgres } from './database';
import { HttpClient } from './http/http-client';
import {
	ResponderFunction,
	ErrorHandlerFunction,
	LogHandlerFunction
} from './method-interface';

// Handlers
import {
	conflictResponder,
	forbiddenResponder,
	goneResponder,
	unauthorizedResponder,
	validationResponder,
	deleteResponder,
	getResponder,
	postResponder,
	patchResponder
} from './responders';
import { logHandler, errorHandler } from './handlers';
import { bindResponders } from './utils/bind-responders';

// Base Models
import { BaseUserInterface, ExampleUser, BaseUser } from './models';
import { env } from './environment';

/**
 * PointyAPI App Instance
 */
export class PointyApi {
	// Express app
	public app: Application = express();

	// Core
	public listen: Function = listen;
	public db: BaseDb;
	public http = new HttpClient();
	public userType: BaseUserInterface = ExampleUser;
	public testmode = false;

	// Middleware

	// Handlers
	public log: LogHandlerFunction = logHandler;
	public error: ErrorHandlerFunction = errorHandler;

	// Responders
	public conflictResponder: ResponderFunction = conflictResponder;
	public forbiddenResponder: ResponderFunction = forbiddenResponder;
	public goneResponder: ResponderFunction = goneResponder;
	public unauthorizedResponder: ResponderFunction = unauthorizedResponder;
	public validationResponder: ResponderFunction = validationResponder;
	public deleteResponder: ResponderFunction = deleteResponder;
	public getResponder: ResponderFunction = getResponder;
	public postResponder: ResponderFunction = postResponder;
	public patchResponder: ResponderFunction = patchResponder;

	// Hooks
	public before: Function = (app: any) => {};
	public ready: Function = (app: any) => {};

	// Initialize
	constructor() {
		// Default db
		this.db = new PointyPostgres();
		this.db.logger = this.log;

		if (process.argv.includes('testmode')) {
			this.testmode = true;
		}

		this.app.on('error', (error) => this.error(error));
	}

	// Ready check
	public readycheck() {
		// Check pointy.userType
		if (!this.userType) {
			console.warn('[PointyAPI] pointy.userType has not been set!');

			return false;
		}

		// Check database connection
		if (!this.db || !this.db.conn) {
			console.warn(
				'[PointyAPI] Database connection has not been established'
			);

			return false;
		}

		// Check database entities
		if (!this.db.entities || !this.db.entities.length) {
			console.warn('[PointyAPI] Database does not contain any entities');

			return false;
		}

		// Check for database entity of BaseUser
		if (this.db.entities.includes(BaseUser)) {
			console.warn('[PointyAPI] BaseUser is not a valid database entity');

			return false;
		}

		// Checks passed
		return true;
	}

	// Start
	public async start() {
		// Set proper headers
		this.app.disable('x-powered-by');

		// Apply middleware functions
		this.app.use(
			(request: Request, response: Response, next: NextFunction) => {
				request.userType = this.userType;
				request.joinMembers = [];

				// Bind the request & response to the responders
				bindResponders(this, request, response);

				next();
			}
		);

		// Use body-parser
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));

		// Run before function
		await this.before(this.app);

		// Ready check
		if (this.readycheck()) {
			// Server listen
			this.listen(this.app, env.PORT, this.log);

			// Send IPC notification
			if ('send' in process && process.send) {
				process.send('server-ready');
			}

			// Run ready callback
			this.ready(this.app);
		}
		else {
			process.exit();
		}
	}
}

export const pointy = new PointyApi();
