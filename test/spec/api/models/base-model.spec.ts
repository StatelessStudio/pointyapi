import { BaseModel } from '../../../../src/models';

/**
 * BaseModel
 * pointyapi/models
 */
describe('[Models] BaseModel', () => {
	it('takes an id parameter', () => {
		const model = new BaseModel(5);
		expect(model.id).toBe(5);
	});
});
