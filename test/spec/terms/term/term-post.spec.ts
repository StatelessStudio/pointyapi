import 'jasmine';
import { pointy } from '../../../../src';
import { User } from '../../../examples/terms/models/user';
import { UserRole } from '../../../../src/enums/user-role';
import { upgradeUserRole } from '../../../../src/utils';

const http = pointy.http;

describe('[Term] Post API', async () => {
	let userAdmin;
	let user;
	let adminToken;
	let token;

	beforeAll(async () => {
		userAdmin = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'adminTermPost1',
				password: 'password123',
				email: 'adminTermPost1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		user = await http
			.post('/api/v1/user', {
				fname: 'jim',
				lname: 'Tester',
				username: 'termPost1',
				password: 'password123',
				email: 'termPost1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		adminToken = await http
			.post('/api/v1/auth', {
				__user: 'adminTermPost1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create token: ' + JSON.stringify(error))
			);

		token = await http
			.post('/api/v1/auth', {
				__user: 'termPost1',
				password: 'password123'
			})
			.catch((error) =>
				fail('Could not create token: ' + JSON.stringify(error))
			);

		await upgradeUserRole(
			'adminTermPost1',
			User,
			UserRole.Admin
		).catch((error) =>
			fail('Could not upgrade user role' + JSON.stringify(error))
		);
	});

	it('allows Admin to a create a term', async () => {
		/*
		await http
			.post(
				'/api/v1/term',
				{
					title: 'Social Studies',
					description: 'Social Studies'
				},
				adminToken.body.token
			)
			.then((result) => {
				expect(result.body).toEqual(jasmine.any(Object));
				expect(result.body['title']).toEqual('Social Studies');
			})
			.catch((error) => fail(JSON.stringify(error)));
		*/
	});

	it('cannot create term as user', async () => {
		await http
			.post(
				'/api/v1/term',
				{
					title: 'Language Arts',
					description: 'Language Arts'
				},
				token.body.token,
				[ 403 ]
			)
			.catch((error) => fail(JSON.stringify(error)));
	});
});
