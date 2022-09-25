import { Request, Response, NextFunction } from 'express';
import { log } from '../log';
const ROOT_PATH = require('app-root-path').toString();

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
	pkg = require(ROOT_PATH + '/node_modules/pointyapi/package.json');
}
catch (ex) {
	pkg = require(ROOT_PATH + '/package.json');
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
