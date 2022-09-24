import 'jasmine';
import { isKeyInModel } from '../../../../src/utils';
import { createMockRequest } from '../../../../src/test-probe';

/**
 * isKeyInModel()
 * pointyapi/utils
 */
describe('[Utils] isKeyInModel()', () => {
	it('returns true if the key is in the model', () => {
		const { request, response } = createMockRequest();
		const model = { id: 1 };

		expect(isKeyInModel('id', model, response)).toBe(true);
	});

	it('returns false & calls validation responder if key is not in model', () => {
		const { request, response } = createMockRequest();
		const model = { id: 1 };

		let hasValidationResponder = false;
		response.validationResponder = () => (hasValidationResponder = true);

		expect(isKeyInModel('username', model, response)).toBe(false);
		expect(hasValidationResponder).toBe(true);
	});

	it('returns true if the member has __', () => {
		const { request, response } = createMockRequest();
		const model = { id: 1 };

		expect(isKeyInModel('__username', model, response)).toBe(true);
	});

	it('returns true if the member is a joined key', () => {
		const { request, response } = createMockRequest();
		const model = { user: 1 };

		expect(isKeyInModel('user.id', model, response)).toBe(true);
	});
});
