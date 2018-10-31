import { pointy } from '../../../../src';
const http = pointy.http;

describe('User API Delete', () => {
	it('can delete', async () => {
		this.result = await http
			.post('/api/v1/user', {
				fname: 'UserDelete1',
				lname: 'UserDelete1',
				username: 'User12345',
				password: 'password123',
				email: 'UserDelete1@test.com'
			})
			.catch((error) => fail(error));

		await http
			.delete(`/api/v1/user/${this.result.body.id}`, [ 204 ])
			.catch((error) => fail(error));
	});
});
