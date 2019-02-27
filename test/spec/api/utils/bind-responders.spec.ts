import { bindResponders } from '../../../../src/utils';
import { createMockRequest } from '../../../../src/test-probe';
import { PointyApi } from '../../../../src/pointy-core';

/**
 * bindResponders()
 * pointyapi/utils
 */
describe('[Utils] bindResponders()', () => {
	beforeAll(() => {
		this.request = {};
		this.response = {};
		this.api = new PointyApi();

		bindResponders(this.api, this.request, this.response);
	});

	it('binds the error handler', () => {
		expect(this.response.error).toEqual(jasmine.any(Function));
	});

	it('binds the log handler', () => {
		expect(this.response.log).toEqual(jasmine.any(Function));
	});

	it('binds the conflictResponder', () => {
		expect(this.response.conflictResponder).toEqual(jasmine.any(Function));
	});

	it('binds the forbiddenResponder', () => {
		expect(this.response.forbiddenResponder).toEqual(jasmine.any(Function));
	});

	it('binds the goneResponder', () => {
		expect(this.response.goneResponder).toEqual(jasmine.any(Function));
	});

	it('binds the unauthorizedResponder', () => {
		expect(this.response.unauthorizedResponder).toEqual(
			jasmine.any(Function)
		);
	});

	it('binds the validationResponder', () => {
		expect(this.response.validationResponder).toEqual(
			jasmine.any(Function)
		);
	});

	it('binds the deleteResponder', () => {
		expect(this.response.deleteResponder).toEqual(jasmine.any(Function));
	});

	it('binds the getResponder', () => {
		expect(this.response.getResponder).toEqual(jasmine.any(Function));
	});

	it('binds the postResponder', () => {
		expect(this.response.postResponder).toEqual(jasmine.any(Function));
	});

	it('binds the patchResponder', () => {
		expect(this.response.patchResponder).toEqual(jasmine.any(Function));
	});
});
