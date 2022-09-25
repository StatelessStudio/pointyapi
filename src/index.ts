// Import handler function types
import { BaseModel, BaseUserInterface, BaseModelInterface } from './models';
import {
	ErrorHandlerFunction,
	ResponderFunction
} from './method-interface';
import { Repository } from 'typeorm';
import * as _express from 'express';

// Extend Express
export interface Request extends _express.Request {
	identifier?: string;
	user?: any;
	userType?: BaseUserInterface;
	payload?: BaseModel | BaseModel[];
	payloadType?: BaseModelInterface;
	repository?: Repository<BaseModel>;
	joinMembers?: string[];
}

export interface Response extends _express.Response {
	error: ErrorHandlerFunction;
	log: (...args) => void;
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

export { NextFunction, Application } from 'express';

// Export root files
export { pointy, PointyApi } from './pointy-core';
export { JwtBearer, jwtBearer } from './jwt-bearer';
export { setModel } from './set-model';
export { log } from './log';
