import { pointy } from '../../../../src';
import { User } from '../../../examples/terms/models/user';
import { UserRole } from '../../../../src/enums/user-role';
import { upgradeUserRole } from '../../../../src/utils';

const http = pointy.http;

describe('[Term] Patch API', async () => {
	beforeAll(async () => {
		this.userAdmin = await http
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

		this.user = await http
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

		this.adminToken = await http
			.post('/api/v1/auth', {
				__user: 'adminTermPatch1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create token: ' + JSON.stringify(error))
			);

		this.token = await http
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
				[ 200 ],
				this.adminToken.body.token
			)
			.catch((error) => fail(JSON.stringify(error)));

		if (term && this.adminToken) {
			await http
				.patch(
					`/api/v1/term/${term.body['id']}`,
					{
						description: 'update'
					},
					[ 204 ],
					this.adminToken.body.token
				)
				.catch((error) => fail(JSON.stringify(error)));
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
				[ 200 ],
				this.adminToken.body.token
			)
			.catch((error) => fail(JSON.stringify(error)));

		if (term && this.token) {
			await http
				.patch(
					`/api/v1/term/${term.body['id']}`,
					{
						description: 'update'
					},
					[ 403 ],
					this.token.body.token
				)
				.catch((error) => fail(JSON.stringify(error)));
		}
	});
});
