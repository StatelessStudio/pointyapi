import { logger } from './logger';
import { env } from './environment';

import * as sourceMapper from 'source-map-support';

sourceMapper.install({
	environment: 'node'
});

async function main() {
	logger.info('Hello ' + env.APP_TITLE);
}
main();
