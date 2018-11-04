import { pointy } from '../../../../src';
const http = pointy.http;

describe('User API Delete', () => {
	it('can delete', () => {
		http
			.post('/api/v1/user', {
				fname: 'User',
				lname: 'Delete',
				username: 'DeleteUser12345',
				password: 'password123',
				email: 'UserDelete1@test.com'
			})
			.then(async (result) => {
				await http
					.delete(`/api/v1/user/${result.body['id']}`, [ 204 ])
					.catch((error) => fail(JSON.stringify(error)));
			})
			.catch((error) => fail(JSON.stringify(error)));
	});
});
