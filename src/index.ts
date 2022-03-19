// Import handler function types
import { BaseModel, BaseUserInterface, BaseModelInterface } from './models';
import {
	ErrorHandlerFunction,
	LogHandlerFunction,
	ResponderFunction
} from './method-interface';
import { Repository } from 'typeorm';

// Extend Express
declare global {
	namespace Express {
		export interface Request {
			identifier?: string;
			user?: any;
			userType?: BaseUserInterface;
			payload?: BaseModel | BaseModel[];
			payloadType?: BaseModelInterface;
			repository?: Repository<BaseModel>;
			joinMembers?: string[];
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
			patchResponder: ResponderFunction;
		}
	}
}

// Export root files
export { pointy, PointyApi } from './pointy-core';
export { JwtBearer, jwtBearer } from './jwt-bearer';
export { setModel } from './set-model';
