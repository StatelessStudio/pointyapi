import { mockRequest } from 'mock-req-res';

import { JwtBearer, jwtBearer } from '../../../src';
import { BaseUser } from '../../../src/models';

/**
 * JWT
 * pointyapi/
 */
describe('[JWT]', () => {
	it('can sign a token', () => {
		expect(jwtBearer.sign(new BaseUser())).toEqual(jasmine.any(String));
	});

	it('can sign a token', () => {
		const jwt = new JwtBearer('test-key');
		expect(jwt.sign(new BaseUser())).toEqual(jasmine.any(String));
		expect(jwt.key).toBe('test-key');
	});

	it('can can verify a token', () => {
		const jwtString = jwtBearer.sign(new BaseUser());

		expect(jwtBearer.dryVerify(jwtString)).not.toEqual(false);
	});

	it('can get an expiration date/time', () => {
		expect(jwtBearer.getExpiration()).toBeGreaterThan(Date.now());
	});

	it('can get a token from request headers', () => {
		// Sign token
		const jwtString = jwtBearer.sign(new BaseUser());

		// Create request
		const request = mockRequest();
		request.header = () => {
			return 'Bearer ' + jwtString;
		};
		request.baseUrl = '/api/v1/user';

		// Check request token
		expect(jwtBearer.getToken(request)).toEqual(jasmine.any(String));
	});

	it('getToken() returns false if token is not valid', () => {
		// Sign token
		const jwtString = jwtBearer.sign(new BaseUser());

		// Create request
		const request = mockRequest();
		request.header = () => {
			return 'invalid ' + jwtString;
		};
		request.baseUrl = '/api/v1/user';

		// Check request token
		expect(jwtBearer.getToken(request)).toBe(false);
	});
});
