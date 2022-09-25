/**
 * # Test Probes
 *
 * Test probes are middleware functions to help debug routes. NOTE: Make sure
 * 	you set the log level to debug to see test-probe output!
 *
 * ## Core Test Probe
 *
 * The core test probe logs information about the current environent
 * (node version, pointyapi version, etc)
 *
 * ## Request Test Probe
 *
 * Troubleshoot incoming requests with the request test probe. This
 * logs information about the current request & body
 *
 * ## User Test Probe
 *
 * Troubleshoot incoming requests by user with the user test probe. This
 * logs information about the auth token & authorized user
 */

export { coreTestProbe } from './core-test-probe';
export { requestTestProbe } from './request-test-probe';
export { userTestProbe } from './user-test-probe';

export { createMockRequest } from './create-mock-request';
