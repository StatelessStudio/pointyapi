// Source mapping
if (!process[Symbol.for('ts-node.register.instance')]) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('source-map-support').install({
		environment: 'node'
	});
}

// Stack traces
Error.stackTraceLimit = Infinity;

// Enter application
import './main';
