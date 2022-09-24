import 'jasmine';
import { pointy } from '../../../../src';
import { User } from '../../../examples/terms/models/user';
import { UserRole } from '../../../../src/enums/user-role';
import { upgradeUserRole } from '../../../../src/utils';
const http = pointy.http;

describe('[Term] Delete API', async () => {
	let userAdmin;
	let user;
	let adminToken;
	let token;

	beforeAll(async () => {
		userAdmin = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'termDel1',
				password: 'password123',
				email: 'termDel1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		user = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'termDel2',
				password: 'password123',
				email: 'termDel2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		adminToken = await http
			.post('/api/v1/auth', {
				__user: 'termDel1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create token: ' + JSON.stringify(error))
			);

		token = await http
			.post('/api/v1/auth', {
				__user: 'termDel2',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create token: ' + JSON.stringify(error))
			);

		await upgradeUserRole('termDel1', User, UserRole.Admin).catch((error) =>
			fail('Could not upgrade user role' + JSON.stringify(error))
		);
	});

	it('allows Admin to delete term', async () => {
		const term = await http
			.post(
				'/api/v1/term',
				{
					title: 'Math',
					description: 'Math'
				},
				adminToken.body.token
			)
			.catch((error) => {
				fail('Could not create term' + JSON.stringify(error));
			});

		if (term && adminToken) {
			await http
				.delete(
					`/api/v1/term/${term.body['id']}`,
					adminToken.body.token
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
		else {
			fail();
		}
	});

	it('cannot delete term if user', async () => {
		const term = await http
			.post(
				'/api/v1/term',
				{
					title: 'Science',
					description: 'Science'
				},
				adminToken.body.token
			)
			.catch((error) => {
				fail('Could not create term' + JSON.stringify(error));
			});

		if (term && token) {
			await http
				.delete(
					`/api/v1/term/${term.body['id']}`,
					token.body.token,
					[ 403 ]
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
		else {
			fail();
		}
	});
});
