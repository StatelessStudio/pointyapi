import 'jasmine';
import {
	readFilter,
	BodyguardKey,
	OnlySelfCanRead
} from '../../../../src/bodyguard';

import { BaseModel, ExampleUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';
import { ChatMessage } from '../../../examples/chat/models/chat-message';
import { User } from '../../../examples/chat/models/user';

/**
 * readFilter()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] readFilter', () => {
	it('filters unauthorized requests', () => {
		// Create user
		let user = new ExampleUser();
		user.id = 1;
		user.email = 'test@example.com';

		// Filter user object
		user = readFilter(user, new ExampleUser(), ExampleUser, ExampleUser);

		// Check if filtered
		expect(user.email).toEqual(undefined);
	});

	it('bypasses authorized requests', () => {
		// Create user
		let user = new ExampleUser();
		user.id = 1;
		user.email = 'test@example.com';

		// Filter user object
		user = readFilter(user, user, ExampleUser, ExampleUser);

		// Expect the object to be unfiltered
		expect(user.email).toEqual('test@example.com');
	});

	it('bypasses admin requests', () => {
		// Create admin user
		const user1 = new ExampleUser();
		user1.id = 1;
		user1.role = UserRole.Admin;

		// Create basic user
		let user2 = new ExampleUser();
		user2.id = 2;
		user2.role = UserRole.Basic;
		user2.email = 'test@example.com';

		// Filter user object
		user2 = readFilter(user2, user1, ExampleUser, ExampleUser);

		// Expect the result to be unfiltered
		expect(user2.email).toEqual('test@example.com');
	});

	it('filters nested arrays', () => {
		// Create users
		const user1 = new User();
		user1.id = 1;
		user1.role = UserRole.Basic;
		user1.password = 'password';

		const user2 = new User();
		user2.id = 2;
		user2.role = UserRole.Basic;
		user2.password = 'password';

		const user3 = new User();
		user3.id = 3;

		// Create resources
		const test1 = new ChatMessage();
		test1.from = user1;

		const test2 = new ChatMessage();
		test2.from = user2;

		// Filter resources
		let results = [ test1, test2 ];
		results = readFilter(results, user3, ExampleUser, ExampleUser);

		// Expect result to be filtered properly
		expect(results).toEqual(jasmine.any(Array));
		expect(results.length).toEqual(2);
		expect(results[0].from).toEqual(jasmine.any(Object));
		expect(results[0].from.id).toBeGreaterThanOrEqual(1);
		expect(results[0].from.password).toBeUndefined();
	});

	it('filters nested objects', () => {
		// Create users
		const user1 = new User();
		const user2 = new User();

		user1.id = 1;
		user2.id = 2;

		user1.password = user2.password = 'password';

		// Create chats
		const chat1 = new ChatMessage();
		const chat2 = new ChatMessage();

		chat1.id = 1;
		chat1.from = user1;
		chat1.to = user2;

		chat2.id = 2;
		chat2.from = user2;
		chat2.to = user1;

		// Filter results
		let results = [ chat1, chat2 ];
		results = readFilter(results, user1, ChatMessage, User);

		// Expect result to be filtered properly
		expect(results[0].id).toBeGreaterThanOrEqual(1);
		expect(results[0].from.id).toBeGreaterThanOrEqual(1);
		expect(results[0].from.password).toBeUndefined();
		expect(results[0].to.id).toBeGreaterThanOrEqual(1);
		expect(results[0].to.password).toBeUndefined();
	});
});
