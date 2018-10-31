import { mockRequest, mockResponse } from 'mock-req-res';

import { setModel } from '../../../../src/';
import { BaseUser } from '../../../../src/models';
import { deleteEndpoint } from '../../../../src/endpoints';
import { getRepository } from 'typeorm';
import { deleteGuard } from '../../../../src/guards';

async function createMockup() {
	const request = mockRequest();
	request.repository = await getRepository(BaseUser);
	request.method = 'DELETE';

	const response = mockResponse();
	response.error = (error) => fail(error);
	response.goneResponder = (error) => fail('Gone: ' + JSON.stringify(error));
	response.deleteResponder = (msg) => fail('Deleted: ' + JSON.stringify(msg));

	return { request, response };
}

describe('[Guards] Endpoint', () => {
	it('can pass', async () => {
		const { request, response } = await createMockup();

		let result = false;

		deleteGuard(request, response, () => {
			result = true;
		});
	});
});