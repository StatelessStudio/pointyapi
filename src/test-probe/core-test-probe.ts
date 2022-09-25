import { Request, Response, NextFunction } from '../index';
import { log } from '../log';

// Package.json interface
let pkg = {
	version: '',
	dependencies: {
		typescript: '',
		express: '',
		typeorm: ''
	}
};

// Try to load package.json
try {
	pkg = require(process.cwd() + '/node_modules/pointyapi/package.json');
}
catch (ex) {
	pkg = require(process.cwd() + '/package.json');
}

/**
 * Core Test Probe: Log results about the Node & PointyAPI Environment
 */
export function coreTestProbe(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	log.debug('[Core Test Probe]\n');
	log.debug('PointyAPI v', pkg.version);
	log.debug('TypeScript v', pkg.dependencies.typescript);
	log.debug('Express v', pkg.dependencies.express);
	log.debug('TypeORM v', pkg.dependencies.typeorm);

	log.debug(
		'\n------------------------------------------------------------'
	);

	next();
}
