import { Request, Response, NextFunction } from 'express';

function recursiveFilter(obj: Object | Object[]) {
	if (obj instanceof Array) {
		// Run recursively on arrays
		for (let i = 0; i < obj.length; i++) {
			obj[i] = recursiveFilter(obj[i]);
		}
	}
	else {
		// Filter sensitive fields
	}

	return obj;
}

export function getFilter(
	request: Request,
	response: Response,
	next: NextFunction
) {
	next();
}
