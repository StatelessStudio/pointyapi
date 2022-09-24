import 'jasmine';
import { User } from '../../../examples/chat/models/user';
import { ChatMessage } from '../../../examples/chat/models/chat-message';
import { getSearchableRelations } from '../../../../src/bodyguard';

/**
 * getSearchableRelations()
 * pointyapi/bodyguard
 */
describe('[Bodyguard] getSearchableRelations', () => {
	it('returns an array of one key for ExampleUser', () => {
		// Create user
		const user = new User();
		user.id = 1;

		// Create Chat Message
		const chat = new ChatMessage();
		chat.from = user;
		chat.to = user;

		// Get readable fields
		const searchableRelations = getSearchableRelations(chat);

		// Expect result to be array of strings, e.g. `from.id`
		expect(searchableRelations).toEqual(jasmine.any(Array));
		expect(searchableRelations.length).toBeGreaterThanOrEqual(4);
		expect(searchableRelations[0]).toEqual(jasmine.any(String));
		expect(searchableRelations[0].includes('.')).toEqual(true);
	});
});
