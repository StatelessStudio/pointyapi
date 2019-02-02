import { createMockRequest } from '../../../../src/test-probe';
import { errorHandler } from '../../../../src/handlers';
import { getRepository } from 'typeorm';
import { BaseUser } from '../../../../src/models';
import { ExampleOwner } from '../../../examples/api/models/example-owner';
import { ExampleRelation } from '../../../examples/api/models/example-relation';

/**
 * errorHandler()
 * pointyapi/handlers
 */
describe('[Handlers] errorHandler', async () => {
	beforeAll(() => {
		// Store console in buffer
		this.cerr = console.error;
		this.clog = console.log;

		// Disable clog && cerr
		console.log = () => {};
		console.error = () => {};
	});

	afterAll(() => {
		// Release console
		console.error = this.cerr;
		console.log = this.clog;
	});

	it('sends a 500 status code', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Override response.sendStatus()
		let result = 0;
		response.sendStatus = (statusCode) => {
			result = statusCode;
		};

		// Test errorHandler()
		errorHandler.bind({ response: response })('Error!');
		expect(result).toEqual(500);
	});

	it('can send custom status codes', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Override response.sendStatus()
		let result = 0;
		response.sendStatus = (statusCode) => {
			result = statusCode;
		};

		// Test errorHandler()
		errorHandler.bind({ response: response })('Error!', 501);
		expect(result).toEqual(501);
	});

	it('responds with validation responder on not null violation', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		const user = new BaseUser();

		// Override validation responder
		let result;
		response.validationResponder = (error) => {
			result = true;
		};

		// Save user && test error handler
		await getRepository(BaseUser)
			.save(user)
			.then(() => fail('Saved with null violation'))
			.catch((error) => {
				errorHandler.bind({ response: response })(error);
			});

		expect(result).toEqual(true);
	});

	it('responds with conflict responder on foreign key violoation', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		const user = new ExampleOwner();
		user.fname = 'tom';
		user.lname = 'doe';
		user.username = 'tomForeignKey';
		user.email = 'tomForeignKey@example.com';
		user.password = 'password123';

		// Create chat message
		const relation = new ExampleRelation();
		relation.owner = user;

		// Save
		const userRepo = getRepository(ExampleOwner);
		const chatRepo = getRepository(ExampleRelation);

		await userRepo
			.save(user)
			.catch((error) =>
				fail('Could not create user: ' + JSON.stringify(error))
			);
		await chatRepo
			.save(relation)
			.catch((error) =>
				fail('Could not create chat: ' + JSON.stringify(error))
			);

		// Override conflict responder
		let result;
		response.conflictResponder = (error) => {
			result = true;
		};

		// Create foreign key violation
		await userRepo
			.remove(user)
			.then(() => fail('Removed user with foregin key'))
			.catch((error) => errorHandler.bind({ response: response })(error));

		expect(result).toBe(true);
	});

	it('responds with conflict responder on duplicate', async () => {
		// Create mock request/response
		const { request, response } = createMockRequest();

		// Create user
		const user1 = new BaseUser();
		user1.fname = 'tom';
		user1.lname = 'doe';
		user1.username = 'tomDuplicate';
		user1.email = 'tomDuplicate@example.com';
		user1.password = 'password123';

		const user2 = new BaseUser();
		user2.fname = 'tom';
		user2.lname = 'doe';
		user2.username = 'tomDuplicate';
		user2.email = 'tomDuplicate@example.com';
		user2.password = 'password123';

		// Override conflict responder
		let result;
		response.conflictResponder = (error) => {
			result = true;
		};

		// Save user && test error handler
		const repo = getRepository(BaseUser);
		await repo.save(user1).catch((error) => fail(error));

		await repo
			.save(user2)
			.then(fail)
			.catch((error) => errorHandler.bind({ response: response })(error));

		expect(result).toEqual(true);
	});
});
