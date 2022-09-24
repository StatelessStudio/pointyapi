import 'jasmine';
import { hashSync } from 'bcryptjs';

import { addResource } from '../../../../src/utils';
import { ExampleUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';
import { getRepository } from 'typeorm';

/**
 * addResource()
 * pointyapi/utils
 */
describe('[Utils] addResource()', () => {
	let cwarn;

	beforeEach(() => {
		cwarn = console.warn;
	});

	afterEach(() => {
		console.warn = cwarn;
	});

	beforeAll(async () => {
		await addResource(ExampleUser, {
			fname: 'Drew',
			lname: 'Immerman',
			username: 'AddDrew1',
			password: hashSync('password123', 12),
			email: 'Drew@test.com',
			role: UserRole.Member
		}).catch(fail);
	});

	it('can add a new resource', async () => {
		const user = await getRepository(ExampleUser)
			.findOne({ username: 'AddDrew1' })
			.catch(fail);

		if (user) {
			expect(user.fname).toEqual('Drew');
		}
	});

	it('accepts template type', async () => {
		await addResource<ExampleUser>(ExampleUser, {
			fname: 'Template',
			lname: 'Type',
			username: 'templatetype',
			password: hashSync('password123', 12),
			email: 'Drew@test.com',
			role: UserRole.Member
		});
	});

	it('can add an existing resource', async () => {
		await addResource(ExampleUser, {
			fname: 'DrewOverride',
			lname: 'Immerman',
			username: 'AddDrew1',
			password: hashSync('password123', 12),
			email: 'Drew@test.com',
			role: UserRole.Member
		}).catch(fail);

		const user = await getRepository(ExampleUser)
			.findOne({ username: 'AddDrew1' })
			.catch(fail);

		if (user) {
			expect(user.fname).toEqual('Drew');
		}
	});
});
