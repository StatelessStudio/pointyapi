// Import handler function types
import {
	BaseUser,
	BaseModel,
	BaseUserInterface,
	BaseModelInterface
} from './models';
import {
	ErrorHandlerFunction,
	LogHandlerFunction,
	ResponderFunction
} from './method-interface';
import { Repository } from 'typeorm';

// Setup defaults
const sessionTTL = 30 * 24 * 60 * 60; // 30 day JWT

process.env['PORT'] = process.env.PORT || '8080';
process.env['JWT_KEY'] = process.env.SESS_KEY || 'dev_key';
process.env['JWT_TTL'] = process.env.SESS_TTL || `${sessionTTL}`;

// Extend Express
declare global {
	namespace Express {
		export interface Request {
			identifier?: string;
			user?: BaseUser;
			userType?: BaseUserInterface;
			payload?: BaseModel | BaseModel[];
			payloadType?: BaseModelInterface;
			repository?: Repository<BaseModel>;
		}

		export interface Response {
			error: ErrorHandlerFunction;
			log: LogHandlerFunction;
			conflictResponder: ResponderFunction;
			forbiddenResponder: ResponderFunction;
			goneResponder: ResponderFunction;
			unauthorizedResponder: ResponderFunction;
			validationResponder: ResponderFunction;
			deleteResponder: ResponderFunction;
			getResponder: ResponderFunction;
			postResponder: ResponderFunction;
			putResponder: ResponderFunction;
		}
	}
}

// Export root files
export { pointy, PointyApi } from './pointy-core';
export { forkServer } from './fork-server';
export { getIdentifierValue } from './get-identifier-value';
export { jwtBearer } from './jwt-bearer';
export { listen } from './listen';
export { setModel } from './set-model';