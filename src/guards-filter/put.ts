import { Request, Response, NextFunction } from 'express';
import { writeFilter, isSelf } from '../bodyguard';
import { BaseModel } from '../models';

export function putFilter(
	request: Request,
	response: Response,
	next: NextFunction
) {
	if (request.payload instanceof BaseModel) {
		const isSelfResult = isSelf(
			request.payload,
			request.user,
			request.payloadType,
			request.userType
		);

		const writeFilterResult = writeFilter(
			request.body,
			request.user,
			request.payloadType,
			request.userType,
			isSelfResult
		);

		if (writeFilterResult === true) {
			next();
		}
		else {
			response.forbiddenResponder(
				'Cannot write member ' + writeFilterResult,
				response
			);
		}
	}
	else {
		response.validationResponder(
			'bad request: payload is not of type BaseModel',
			response
		);
	}
}
