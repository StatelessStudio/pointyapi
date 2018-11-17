import { Request, Response, NextFunction } from 'express';
const ROOT_PATH = require('app-root-path').toString();

let pkg = {
	version: '',
	dependencies: {
		typescript: '',
		express: '',
		typeorm: ''
	}
};

try {
	pkg = require(ROOT_PATH + '/node_modules/pointyapi/package.json');
} catch (ex) {
	pkg = require(ROOT_PATH + '/package.json');
}

export function coreTestProbe(
	request: Request,
	response: Response,
	next: NextFunction
) {
	console.log('\n[DEBUG] [Core Test Probe]\n');
	console.log('PointyAPI v', pkg.version);
	console.log('TypeScript v', pkg.dependencies.typescript);
	console.log('Express v', pkg.dependencies.express);
	console.log('TypeORM v', pkg.dependencies.typeorm);

	console.log(
		'\n------------------------------------------------------------'
	);

	next();
}
