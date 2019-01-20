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

				response.error = this.error.bind({
					request: request,
					response: response
				});
				response.log = this.log.bind({
					request: request,
					response: response
				});
				response.conflictResponder = this.conflictResponder.bind({
					request: request,
					response: response
				});
				response.forbiddenResponder = this.forbiddenResponder.bind({
					request: request,
					response: response
				});
				response.goneResponder = this.goneResponder.bind({
					request: request,
					response: response
				});
				response.unauthorizedResponder = this.unauthorizedResponder.bind(
					{
						request: request,
						response: response
					}
				);
				response.validationResponder = this.validationResponder.bind({
					request: request,
					response: response
				});
				response.deleteResponder = this.deleteResponder.bind({
					request: request,
					response: response
				});
				response.getResponder = this.getResponder.bind({
					request: request,
					response: response
				});
				response.postResponder = this.postResponder.bind({
					request: request,
					response: response
				});
				response.putResponder = this.putResponder.bind({
					request: request,
					response: response
				});

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
