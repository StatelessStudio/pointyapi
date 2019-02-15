import { compareSync } from 'bcryptjs';

import { BaseUser } from '../../../../src/models';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * BaseUser
 * pointyapi/models
 */
describe('[Models] BaseUser', () => {
	it('calls validation responder if the password is not set', async () => {
		const user = new BaseUser();

		const { request, response } = createMockRequest();

		let result = false;
		response.validationResponder = () => {
			result = true;
		};

		await user.beforePost.bind(request.body)(request, response);

		expect(result).toBe(true);
	});

	it('hashes the password in beforePost()', async () => {
		const user = new BaseUser();

		const { request, response } = createMockRequest();
		request.body.password = 'password123';

		response.validationResponder = (error) => fail(error);

		await user.beforePost.bind(request.body)(request, response);

		expect(compareSync('password123', request.body.password)).toBe(true);
	});

	it('hashes the password in beforePut()', async () => {
		const user = new BaseUser();

		const { request, response } = createMockRequest();
		request.body.password = 'password123';

		response.validationResponder = (error) => fail(error);

		await user.beforePut.bind(request.body)(request, response);

		expect(compareSync('password123', request.body.password)).toBe(true);
	});
});
