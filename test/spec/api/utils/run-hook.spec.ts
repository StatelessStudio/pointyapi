import 'jasmine';
import { Request, Response } from 'express';
import { BaseModel } from '../../../../src/models';

import { createMockRequest } from '../../../../src/test-probe';
import { runHook } from '../../../../src/utils';

class TestHooks extends BaseModel {
	public password: string = undefined;

	public async hookReturnsTrue(request: Request, response: Response) {
		return true;
	}

	public async hookDoesNothing(request: Request, response: Response) {}

	public async hookReturnsFalse(request: Request, response: Response) {
		return false;
	}

	public async hookSendsResponse(request: Request, response: Response) {
		response.validationResponder({});

		return false;
	}

	public async hookThrowsError(request: Request, response: Response) {
		throw new Error();
	}

	public async hookModifiesMember(request: Request, response: Response) {
		this.password = 'bob';

		return true;
	}
}

/**
 * runHook()
 * pointyapi/utils
 */
describe('[Utils] runHook()', () => {
	it('runs the hook', async () => {
		const { request, response } = createMockRequest();

		const result = await runHook(
			'hookReturnsTrue',
			new TestHooks(),
			request,
			response
		);

		expect(result).toBeTruthy();
	});

	it('calls response.error if the hook does not return true', async () => {
		const { request, response } = createMockRequest();

		let hasError = false;
		response.error = () => (hasError = true);

		const result = await runHook(
			'hookDoesNothing',
			new TestHooks(),
			request,
			response
		);

		expect(result).toBe(false);
		expect(hasError).toBe(true);
	});

	it('calls response.error if the hook returns false', async () => {
		const { request, response } = createMockRequest();

		let hasError = false;
		response.error = () => (hasError = true);

		const result = await runHook(
			'hookReturnsFalse',
			new TestHooks(),
			request,
			response
		);

		expect(result).toBe(false);
		expect(hasError).toBe(true);
	});

	it('calls response.error if the hook throws an error', async () => {
		const { request, response } = createMockRequest();

		let hasError = false;
		response.error = () => (hasError = true);

		const result = await runHook(
			'hookThrowsError',
			new TestHooks(),
			request,
			response
		);

		expect(result).toBe(false);
		expect(hasError).toBe(true);
	});

	it('returns false if the hook has already sent a response', async () => {
		const { request, response } = createMockRequest();

		let hasValidationError = false;
		response.validationResponder = () => {
			hasValidationError = true;
			response.headersSent = true;
		};

		const result = await runHook(
			'hookSendsResponse',
			new TestHooks(),
			request,
			response
		);

		expect(result).toBe(false);
		expect(hasValidationError).toBe(true);
	});

	it('persists changes to resource', async () => {
		const { request, response } = createMockRequest();
		const tester = new TestHooks();

		const result = await runHook(
			'hookModifiesMember',
			tester,
			request,
			response
		);

		expect(result).toBeTruthy();
		expect(tester.password).toEqual('bob');
	});

	it('persists changes to an array of resources', async () => {
		const { request, response } = createMockRequest();
		const testers = [ new TestHooks(), new TestHooks() ];

		const result = await runHook(
			'hookModifiesMember',
			testers,
			request,
			response
		);

		expect(result).toBeTruthy();
		expect(testers[0].password).toEqual('bob');
		expect(testers[1].password).toEqual('bob');
	});
});
