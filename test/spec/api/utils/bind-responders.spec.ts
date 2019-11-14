import { bindResponders } from '../../../../src/utils';
import { createMockRequest } from '../../../../src/test-probe';
import { PointyApi } from '../../../../src/pointy-core';

/**
 * bindResponders()
 * pointyapi/utils
 */
describe('[Utils] bindResponders()', () => {
	let request;
	let response;
	let api;

	beforeAll(() => {
		request = {};
		response = {};
		api = new PointyApi();

		bindResponders(api, request, response);
	});

	it('binds the error handler', () => {
		expect(response.error).toEqual(jasmine.any(Function));
	});

	it('binds the log handler', () => {
		expect(response.log).toEqual(jasmine.any(Function));
	});

	it('binds the conflictResponder', () => {
		expect(response.conflictResponder).toEqual(jasmine.any(Function));
	});

	it('binds the forbiddenResponder', () => {
		expect(response.forbiddenResponder).toEqual(jasmine.any(Function));
	});

	it('binds the goneResponder', () => {
		expect(response.goneResponder).toEqual(jasmine.any(Function));
	});

	it('binds the unauthorizedResponder', () => {
		expect(response.unauthorizedResponder).toEqual(
			jasmine.any(Function)
		);
	});

	it('binds the validationResponder', () => {
		expect(response.validationResponder).toEqual(
			jasmine.any(Function)
		);
	});

	it('binds the deleteResponder', () => {
		expect(response.deleteResponder).toEqual(jasmine.any(Function));
	});

	it('binds the getResponder', () => {
		expect(response.getResponder).toEqual(jasmine.any(Function));
	});

	it('binds the postResponder', () => {
		expect(response.postResponder).toEqual(jasmine.any(Function));
	});

	it('binds the patchResponder', () => {
		expect(response.patchResponder).toEqual(jasmine.any(Function));
	});
});
