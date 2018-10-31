import { mockRequest, mockResponse } from 'mock-req-res';
import { getRepository } from 'typeorm';

import { setModel } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { postEndpoint } from '../../../../src/endpoints';

async function createMockup() {
	const request = mockRequest();
	request.repository = await getRepository(BaseUser);
	request.method = 'POST';

	const response = mockResponse();
	response.error = (error) => fail(error);
	response.validationResponder = (msg) =>
		fail('Validation: ' + JSON.stringify(msg));
	response.postResponder = (msg) => fail('Deleted: ' + JSON.stringify(msg));

	return { request, response };
}

describe('[Endpoints] Post', () => {
	it('can post', async () => {
		const { request, response } = await createMockup();

		const user = new BaseUser();
		user.fname = 'Post';
		user.lname = 'Endpoint';
		user.username = 'postEndpoint';
		user.password = 'password123';
		user.email = 'post@example.com';

		request.body = user;

		setModel(request, response, BaseUser);

		response.postResponder = () => {};
		await postEndpoint(request, response).catch((error) => fail(error));
	});

	it('calls validationResponder for a bad request', async () => {
		const { request, response } = await createMockup();

		const user = new BaseUser();
		user.fname = 'Post';
		user.lname = 'Endpoint';
		user.username = 'postEndpoint2';
		user.password = 'password123';
		user.email = 'testy';

		request.body = user;

		setModel(request, response, BaseUser);

		response.validationResponder = () => {};
		await postEndpoint(request, response).catch((error) => fail(error));
	});
});
