import { pointy } from '../../../../src';
import { User } from '../../../examples/terms/models/user';
import { UserRole } from '../../../../src/enums/user-role';
import { upgradeUserRole } from '../../../../src/utils';

const http = pointy.http;

describe('[User] API Read', () => {
	beforeAll(async () => {
		this.userAdmin = await http
			.post('/api/v1/user', {
				fname: 'userAdmin',
				lname: 'userAdmin',
				username: 'adminGuardGet1',
				password: 'password123',
				email: 'adminGuardGet1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		this.adminToken = await http
			.post('/api/v1/auth', {
				__user: 'adminGuardGet1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create User API Token' + +JSON.stringify(error))
			);

		await upgradeUserRole(
			'adminGuardGet1',
			User,
			UserRole.Admin
		).catch((error) =>
			fail('Could not upgrade user role' + JSON.stringify(error))
		);

		this.term = await http
			.post(
				'/api/v1/term',
				{
					title: 'User Term'
				},
				[ 200 ],
				this.adminToken.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['title']).toEqual('User Term');

				return result;
			})
			.catch((error) => fail(JSON.stringify(error)));
	});

	it('can read term relations', async () => {
		// Create base user
		const user = await http
			.post('/api/v1/user', {
				fname: 'relationPatch',
				lname: 'relationPatch',
				username: 'relationPatch',
				password: 'password123',
				email: 'relationPatch@test.com',
				termRelations: [ this.term.body ]
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		if (user) {
			// Get & check result
			await http
				.get('/api/v1/user', {
					where: { username: user.body['username'] },
					join: [ 'termRelations' ]
				})
				.then((result) => {
					expect(result.body).toEqual(jasmine.any(Array));
					expect(result.body['length']).toBe(1);
					expect(result.body[0]).toEqual(jasmine.any(Object));
					expect(result.body[0].id).toBeGreaterThanOrEqual(1);
					expect(result.body[0].termRelations).toEqual(
						jasmine.any(Array)
					);
					expect(result.body[0].termRelations['length']).toBe(1);
				})
				.catch((error) => fail('Cannot get: ' + JSON.stringify(error)));
		}
		else {
			fail();
		}
	});
});
