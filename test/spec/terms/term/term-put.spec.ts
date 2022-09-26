import 'jasmine';
import { pointy } from '../../../../src';
import { User } from '../../../examples/terms/models/user';
import { UserRole } from '../../../../src/enums/user-role';
import { upgradeUserRole } from '../../../../src/utils';

const http = pointy.http;

describe('[Term] Patch API', async () => {
	let userAdmin;
	let user;
	let adminToken;
	let token;

	beforeAll(async () => {
		userAdmin = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'adminTermPatch1',
				password: 'password123',
				email: 'adminTermPatch1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		user = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'termPatch1',
				password: 'password123',
				email: 'termPatch1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		adminToken = await http
			.post('/api/v1/auth', {
				__user: 'adminTermPatch1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create token: ' + JSON.stringify(error))
			);

		token = await http
			.post('/api/v1/auth', {
				__user: 'termPatch1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create token: ' + JSON.stringify(error))
			);

		await upgradeUserRole(
			'adminTermPatch1',
			User,
			UserRole.Admin
		).catch((error) =>
			fail('Could not upgrade user role' + JSON.stringify(error))
		);
	});

	it('allows Admin to update term', async () => {
		const term = await http
			.post(
				'/api/v1/term',
				{
					title: 'test',
					description: 'test'
				},
				adminToken.body.token
			);

		if (term && adminToken) {
			await http
				.patch(
					`/api/v1/term/${term.body['id']}`,
					{
						description: 'update'
					},
					adminToken.body.token
				);
		}
		else {
			fail();
		}
	});

	it('cannot update term as user', async () => {
		const term = await http
			.post(
				'/api/v1/term',
				{
					title: 'test2',
					description: 'test2'
				},
				adminToken.body.token
			);

		if (term && token) {
			await http
				.patch(
					`/api/v1/term/${term.body['id']}`,
					{
						description: 'update'
					},
					token.body.token,
					[ 403 ]
				);
		}
	});
});
