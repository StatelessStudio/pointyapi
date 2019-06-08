import {
	writeFilter,
	BodyguardKey,
	OnlySelfCanRead
} from '../../../../src/bodyguard';

import { BaseModel, ExampleUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';
import { ChatMessage } from '../../../examples/chat/models/chat-message';
import { User } from '../../../examples/chat/models/user';

/**
 * writeFilter()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] writeFilter', () => {
	it('filters unauthorized requests', () => {
		// Filter user object
		const result = writeFilter(
			{ email: 'test@example.com' },
			new ExampleUser(),
			ExampleUser,
			ExampleUser,
			false
		);

		// Check if filtered
		expect(result).toEqual('email');
	});

	it('bypasses authorized requests', () => {
		// Filter user object
		const result = writeFilter(
			{ email: 'test@example.com' },
			new ExampleUser(),
			ExampleUser,
			ExampleUser,
			true
		);

		// Expect the object to be unfiltered
		expect(result).toBe(true);
	});

	it('bypasses admin requests', () => {
		// Create admin user
		const admin = new ExampleUser();
		admin.id = 1;
		admin.role = UserRole.Admin;

		// Filter user object
		const result = writeFilter(
			{ email: 'test@example.com' },
			admin,
			ExampleUser,
			ExampleUser
		);

		// Expect the result to be unfiltered
		expect(result).toBe(true);
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
		const results = [ test1, test2 ];
		const result = writeFilter(results, user3, ExampleUser, ExampleUser);

		// Expect result to be filtered properly
		expect(result).toBe('[#0]id');
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
		const results = [ chat1, chat2 ];
		const result = writeFilter(results, user1, ChatMessage, User);

		// Expect result to be filtered properly
		expect(result).toBe('[#0]id');
	});
});
