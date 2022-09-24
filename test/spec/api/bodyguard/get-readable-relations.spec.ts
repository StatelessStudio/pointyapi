import 'jasmine';
import { User } from '../../../examples/chat/models/user';
import { ChatMessage } from '../../../examples/chat/models/chat-message';
import {
	getReadableRelations,
	CanReadRelation
} from '../../../../src/bodyguard';
import { BaseModel, ExampleUser } from '../../../../src/models';
import { UserRole } from '../../../../src/enums';

class AnyoneCanReadRelationModel extends BaseModel {
	@CanReadRelation() public anyoneCanRead: ExampleUser = undefined;
}

/**
 * getReadableRelations()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] getReadableRelations', () => {
	it('returns an keys for Chat User', () => {
		// Create user
		const user = new User();
		user.id = 1;

		// Create Chat Message
		const chat = new ChatMessage();
		chat.from = user;
		chat.to = user;

		// Get readable fields
		const searchableRelations = getReadableRelations(chat, user);

		// Expect result to be array of strings, e.g. `from.id`
		expect(searchableRelations).toEqual(jasmine.any(Array));
		expect(searchableRelations.length).toBeGreaterThanOrEqual(2);
		expect(searchableRelations[0]).toEqual(jasmine.any(String));
	});

	it('returns no keys for Chat User when not logged in', () => {
		// Create user
		const user = new User();
		user.id = 1;

		// Create Chat Message
		const chat = new ChatMessage();
		chat.from = user;
		chat.to = user;

		// Get readable fields
		const searchableRelations = getReadableRelations(chat, new User());

		// Expect result to be array of strings, e.g. `from.id`
		expect(searchableRelations).toEqual(jasmine.any(Array));
		expect(searchableRelations.length).toBe(0);
	});

	it('returns akeys for admin Chat User', () => {
		// Create user
		const user = new User();
		user.id = 1;

		const admin = new User();
		admin.id = 2;
		admin.role = UserRole.Admin;

		// Create Chat Message
		const chat = new ChatMessage();
		chat.from = user;
		chat.to = user;

		// Get readable fields
		const searchableRelations = getReadableRelations(chat, admin);

		// Expect result to be array of strings, e.g. `from.id`
		expect(searchableRelations).toEqual(jasmine.any(Array));
		expect(searchableRelations.length).toBeGreaterThanOrEqual(2);
		expect(searchableRelations[0]).toEqual(jasmine.any(String));
	});

	it('returns keys for AnyoneCanReadRelationModel', () => {
		// Create user
		const user = new User();
		user.id = 1;

		// Create Chat Message
		const chat = new AnyoneCanReadRelationModel();
		chat.anyoneCanRead = user;

		// Get readable fields
		const searchableRelations = getReadableRelations(chat, new User());

		// Expect result to be array of strings, e.g. `from.id`
		expect(searchableRelations).toEqual(jasmine.any(Array));
		expect(searchableRelations.length).toBe(1);
	});
});
