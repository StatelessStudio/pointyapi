// Express
const express = require('express');
import { Response, Request, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

// Pointy Core
import { listen } from './listen';
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
	putResponder
} from './responders';
import { logHandler, errorHandler } from './handlers';
import { BaseUser, BaseUserInterface } from './models';

export class PointyApi {
	// Express app
	public app = express();

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
	public putResponder: ResponderFunction = putResponder;

	// Hooks
	public before: Function = (app: any) => {};

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
		// Apply middleware functions
		this.app.use(
			(request: Request, response: Response, next: NextFunction) => {
				request.userType = this.userType;
				request.joinMembers = [];

				response.error = this.error;
				response.log = this.log;
				response.conflictResponder = this.conflictResponder;
				response.forbiddenResponder = this.forbiddenResponder;
				response.goneResponder = this.goneResponder;
				response.unauthorizedResponder = this.unauthorizedResponder;
				response.validationResponder = this.validationResponder;
				response.deleteResponder = this.deleteResponder;
				response.getResponder = this.getResponder;
				response.postResponder = this.postResponder;
				response.putResponder = this.putResponder;

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
	}
}

export const pointy = new PointyApi();
