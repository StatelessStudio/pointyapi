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
import { BaseUser, BaseUserInterface } from './models';

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
	public userType: BaseUserInterface = BaseUser;

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
		this.db.errorHandler = this.error;

		this.app.on('error', (error) => this.error(error));
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

		// Run start function
		await this.before(this.app);

		// Server listen
		this.listen(this.app, process.env.PORT, this.log);

		this.ready(this.app);
	}
}

export const pointy = new PointyApi();
