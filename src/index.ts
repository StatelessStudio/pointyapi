// Bootstrap source mapping
import * as sourceMapper from 'source-map-support';

sourceMapper.install({
	environment: 'node'
});

// Enter application
import './main';
