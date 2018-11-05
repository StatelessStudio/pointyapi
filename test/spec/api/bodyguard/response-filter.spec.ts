import { Request } from 'express';

import {
	responseFilter,
	BodyguardKey,
	OnlySelfCanRead
} from '../../../../src/bodyguard';

import { BaseModel, BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';

class TestModel extends BaseModel {
	@BodyguardKey()
	@OnlySelfCanRead()
	public owner: BaseUser = undefined;

	@OnlySelfCanRead() public message: string = undefined;
}

describe('[Bodyguard] responseFilter', () => {
	it('filters unauthorized requests', () => {
		let user = new BaseUser();
		user.id = 1;
		user.email = 'test@example.com';

		user = responseFilter(user, new BaseUser(), BaseUser, BaseUser);

		expect(user.role).toEqual(undefined);
	});

	it('bypasses authorized requests', () => {
		let user = new BaseUser();
		user.id = 1;
		user.email = 'test@example.com';

		user = responseFilter(user, user, BaseUser, BaseUser);

		expect(user.email).toEqual('test@example.com');
	});

	it('bypasses admin requests', () => {
		const user1 = new BaseUser();
		user1.id = 1;
		user1.role = UserRole.Admin;

		let user2 = new BaseUser();
		user2.id = 2;
		user2.role = UserRole.Basic;
		user2.email = 'test@example.com';

		user2 = responseFilter(user2, user1, BaseUser, BaseUser);

		expect(user2.email).toEqual('test@example.com');
	});

	it('filters nested arrays', () => {
		const user1 = new BaseUser();
		user1.id = 1;
		user1.role = UserRole.Basic;

		const user2 = new BaseUser();
		user2.id = 2;
		user2.role = UserRole.Basic;

		const test1 = new TestModel();
		test1.owner = user1;

		const test2 = new TestModel();
		test2.owner = user2;

		let results = [ test1, test2 ];

		results = responseFilter(results, new BaseUser(), BaseUser, BaseUser);

		expect(results).toEqual(jasmine.any(Array));
		expect(results.length).toEqual(2);
		expect(results[0].owner).toBe(undefined);
	});
});
