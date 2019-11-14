import { pointy } from '../../../../src';
import { User } from '../../../examples/terms/models/user';
import { UserRole } from '../../../../src/enums/user-role';
import { upgradeUserRole } from '../../../../src/utils';

const http = pointy.http;

describe('[Term] API Read', async () => {
	let userAdmin;
	let adminToken;
	let term;

	beforeAll(async () => {
		userAdmin = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'adminTermGet1',
				password: 'password123',
				email: 'adminTermGet1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		adminToken = await http
			.post('/api/v1/auth', {
				__user: 'adminTermGet1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create token: ' + JSON.stringify(error))
			);

		await upgradeUserRole(
			'adminTermGet1',
			User,
			UserRole.Admin
		).catch((error) =>
			fail('Could not upgrade user role' + JSON.stringify(error))
		);

		term = await http
			.post(
				'/api/v1/term',
				{
					title: 'History',
					description: 'History'
				},
				adminToken.body.token
			)
			.catch((error) => {
				fail('Could not create term' + JSON.stringify(error));
			});
	});

	it('allows anyone to read the term', async () => {
		await http
			.get('/api/v1/term', {})
			.then((result) => expect(result.body).toEqual(jasmine.any(Array)))
			.catch((error) => fail(JSON.stringify(error)));
	});
});
