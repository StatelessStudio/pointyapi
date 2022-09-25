import 'jasmine';
import { pointy } from '../../../../src';
const http = pointy.http;

describe('User API Update', () => {
	let user1;

	beforeAll(async () => {
		user1 = await http
			.post('/api/v1/user', {
				fname: 'userPatch',
				lname: 'userPatch',
				username: 'basicUserPatch1',
				password: 'password123',
				email: 'basicUserPatch1@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);
	});

	it('can update', async () => {
		await http
			.patch(`/api/v1/user/${user1.body.id}`, {
				lname: 'testLast'
			});

		await http
			.get('/api/v1/user', {
				id: user1.body.id
			})
			.then((getResult) =>
				expect(getResult.body['lname']).toEqual('testLast')
			);
	});

	it('can clear a field that has already been set', async () => {
		const user = await http
			.post('/api/v1/user', {
				fname: 'userPatch',
				lname: 'userPatch',
				username: 'basicUserPatch2',
				password: 'password123',
				email: 'basicUserPatch2@test.com'
			})
			.catch((error) =>
				fail('Could not create base user: ' + JSON.stringify(error))
			);

		if (user) {
			await http
				.patch(
					`/api/v1/user/${user.body['id']}`,
					{
						email: ''
					},
					undefined,
					[ 204 ]
				);

			await http
				.get('/api/v1/user', {
					id: user.body['id']
				})
				.then((getResult) =>
					expect(getResult.body['email']).toEqual(null)
				);
		}
		else {
			fail('Could not create base user');
		}
	});

	it('maintains other fields on update', async () => {
		await http
			.patch(
				`/api/v1/user/${user1.body.id}`,
				{
					lname: 'testLast'
				},
				undefined,
				[ 204 ]
			);

		await http
			.get('/api/v1/user', {
				id: user1.body.id
			})
			.then((getResult) =>
				expect(getResult.body['email']).toEqual(
					'basicUserPatch1@test.com'
				)
			);
	});

	it('cannot accept a nonsense username', async () => {
		await http
			.patch(
				`/api/v1/user/${user1.body.id}`,
				{
					username: 'tom<tester5'
				},
				undefined,
				[ 400 ]
			);
	});

	it('cannot accept a nonsense email', async () => {
		await http
			.patch(
				`/api/v1/user/${user1.body.id}`,
				{
					email: 'drew3test.com'
				},
				undefined,
				[ 400 ]
			);
	});

	it('removes undefined members', async () => {
		await http
			.patch(`/api/v1/user/${user1.body.id}`, {
				biography: undefined
			});
	});
});
