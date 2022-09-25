// Express
import * as express from 'express';
import { Response, Request, NextFunction, Application } from './index';
import * as bodyParser from 'body-parser';

// Pointy Core
import { ListenFunction, listen } from './utils/listen';
import { BaseDb, PointyPostgres } from './database';
import { HttpClient } from './http/http-client';
import {
	ResponderFunction,
	ErrorHandlerFunction,
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
import { errorHandler } from './handlers';
import { bindResponders } from './utils/bind-responders';
import { env } from './environment';
import { log } from './log';

// Base Models
import { BaseUserInterface, ExampleUser, BaseUser } from './models';

export type ServerHookFunction = (app: Application) => void;

/**
 * PointyAPI App Instance
 */
export class PointyApi {
	// Express app
	public app: Application = express();

	// Core
	public listen: ListenFunction = listen;
	public db: BaseDb;
	public http = new HttpClient();
	public userType: BaseUserInterface = ExampleUser;
	public testmode = false;

	// Middleware

	// Handlers
	public log = log.debug;
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
	public before: ServerHookFunction = (app: Express.Application) => {};
	public ready: ServerHookFunction = (app: Express.Application) => {};

	// Initialize
	constructor() {
		// Default db
		this.db = new PointyPostgres();

		if (process.argv.includes('testmode')) {
			this.testmode = true;
		}

		this.app.on('error', (error) => this.error(error));
	}

	// Ready check
	public readycheck() {
		// Check pointy.userType
		if (!this.userType) {
			log.warn('[PointyAPI] pointy.userType has not been set!');

			return false;
		}

		// Check database connection
		if (!this.db || !this.db.conn) {
			log.warn(
				'[PointyAPI] Database connection has not been established'
			);

			return false;
		}

		// Check database entities
		if (!this.db.entities || !this.db.entities.length) {
			log.warn('[PointyAPI] Database does not contain any entities');

			return false;
		}

		// Check for database entity of BaseUser
		if (this.db.entities.includes(BaseUser)) {
			log.warn('[PointyAPI] BaseUser is not a valid database entity');

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
			await this.listen(this.app, env.PORT);

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
