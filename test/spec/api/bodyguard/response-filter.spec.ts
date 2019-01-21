import {
	responseFilter,
	BodyguardKey,
	OnlySelfCanRead
} from '../../../../src/bodyguard';

import { BaseModel, BaseUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';
import { ChatMessage } from '../../../examples/chat/models/chat-message';
import { User } from '../../../examples/chat/models/user';

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
		user1.password = 'password';

		const user2 = new BaseUser();
		user2.id = 2;
		user2.role = UserRole.Basic;
		user2.password = 'password';

		const user3 = new BaseUser();
		user3.id = 3;

		const test1 = new TestModel();
		test1.owner = user1;

		const test2 = new TestModel();
		test2.owner = user2;

		let results = [ test1, test2 ];

		results = responseFilter(results, user3, BaseUser, BaseUser);

		expect(results).toEqual(jasmine.any(Array));
		expect(results.length).toEqual(2);
		expect(results[0].owner).toEqual(jasmine.any(Object));
		expect(results[0].owner.id).toBeGreaterThanOrEqual(1);
		expect(results[0].owner.password).toBeUndefined();
	});

	it('filters nested objects', () => {
		const user1 = new User();
		const user2 = new User();

		const chat1 = new ChatMessage();
		const chat2 = new ChatMessage();

		user1.id = 1;
		user2.id = 2;

		user1.password = user2.password = 'password';

		chat1.id = 1;
		chat1.from = user1;
		chat1.to = user2;

		chat2.id = 2;
		chat2.from = user2;
		chat2.to = user1;

		let results = [ chat1, chat2 ];

		results = responseFilter(results, user1, ChatMessage, User);

		expect(results[0].id).toBeGreaterThanOrEqual(1);
		expect(results[0].from.id).toBeGreaterThanOrEqual(1);
		expect(results[0].from.password).toBeUndefined();
		expect(results[0].to.id).toBeGreaterThanOrEqual(1);
		expect(results[0].to.password).toBeUndefined();
	});
});
