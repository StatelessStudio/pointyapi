import { queryValidator } from '../../../../src/query-tools/query-validator';
import { createMockRequest } from '../../../../src/test-probe';
import { ExampleUser } from '../../../../src/models';

/**
 * queryValidator()
 * pointyapi/utils
 */
describe('[Utils] queryValidator()', () => {
	it('returns true if the query is valid', () => {
		const { request, response } = createMockRequest();
		request.query = { where: { id: 1 } };
		request.payloadType = ExampleUser;
		request.payload = new ExampleUser();

		let hasValidationResponder = false;
		response.validationResponder = () => (hasValidationResponder = true);

		expect(queryValidator(request, response)).toBe(true);
		expect(hasValidationResponder).toBe(false);
	});

	it('deletes undefined members', () => {
		const { request, response } = createMockRequest();
		request.query = {
			where: { fname: undefined },
			not: undefined,
			join: [ undefined ]
		};
		request.payloadType = ExampleUser;
		request.payload = new ExampleUser();

		let hasValidationResponder = false;
		response.validationResponder = () => (hasValidationResponder = true);

		expect(queryValidator(request, response)).toBe(true);
		expect(hasValidationResponder).toBe(false);
		expect('not' in request.query).toBe(false);
		expect('fname' in request.query['where']).toBe(false);
		expect(request.query.join.length).toBe(0);
	});

	it('fires validation responder if the query type is invalid', () => {
		const { request, response } = createMockRequest();
		request.query = { were: { id: 1 } };
		request.payloadType = ExampleUser;
		request.payload = new ExampleUser();

		let hasValidationResponder = false;
		response.validationResponder = () => (hasValidationResponder = true);

		expect(queryValidator(request, response)).toBe(false);
		expect(hasValidationResponder).toBe(true);
	});

	it('fires validation responder if the query has invalid value type', () => {
		const { request, response } = createMockRequest();
		request.query = { where: [ 1 ] };
		request.payloadType = ExampleUser;
		request.payload = new ExampleUser();

		let hasValidationResponder = false;
		response.validationResponder = () => (hasValidationResponder = true);

		expect(queryValidator(request, response)).toBe(false);
		expect(hasValidationResponder).toBe(true);
	});

	it('fires validation responder if a key is not in the model (object)', () => {
		const { request, response } = createMockRequest();
		request.query = { where: { notInModel: 'test' } };
		request.payloadType = ExampleUser;
		request.payload = new ExampleUser();

		let hasValidationResponder = false;
		response.validationResponder = () => (hasValidationResponder = true);

		expect(queryValidator(request, response)).toBe(false);
		expect(hasValidationResponder).toBe(true);
	});

	it('fires validation responder if a key is not in the model (array)', () => {
		const { request, response } = createMockRequest();
		request.query = { join: [ 'notInModel' ] };
		request.payloadType = ExampleUser;
		request.payload = new ExampleUser();

		let hasValidationResponder = false;
		response.validationResponder = () => (hasValidationResponder = true);

		expect(queryValidator(request, response)).toBe(false);
		expect(hasValidationResponder).toBe(true);
	});

	it('can get with additional parameters', async () => {
		const { request, response } = createMockRequest();
		request.query = {
			where: { id: 1 },
			additionalParameters: {
				categories: [ 1, 2, 3 ]
			}
		};
		request.payloadType = ExampleUser;
		request.payload = new ExampleUser();

		let hasValidationResponder = false;
		response.validationResponder = (result) =>
			(hasValidationResponder = result);

		expect(queryValidator(request, response)).toBe(true);
		expect(hasValidationResponder).toBe(false);
	});
});
