# PointyAPI

*"Stop writing endpoints"*

Typescript RESTful Server Architecture

[![Build Status](https://travis-ci.org/StatelessStudio/pointyapi.svg?branch=master)](https://travis-ci.org/StatelessStudio/pointyapi)
[![Coverage Status](https://coveralls.io/repos/github/StatelessStudio/pointyapi/badge.svg?branch=master)](https://coveralls.io/github/StatelessStudio/pointyapi?branch=master).

Created and maintained by [Stateless Studio](https://stateless.studio)
## Introduction

PointyAPI is a library for quickly creating robust API servers.

- **ORM** *(TypeORM)* Create models which automatically create and maintain your database
- **Validation** *(Class Validator)* Use Typescript decorators to automatically validate fields
- **Authentication** *(JWT)* JWT and `request.user` make authorization a breeze
- **Authorization** Use Guards, `CanRead()`, and `CanWrite()` fields to ensure the user can read/write specific fields

### Models

Models are created as Typescript classes. Here's an example class for a basic user:

```typescript
@Entity()
class User extends BaseUser
{
	// User ID
	@PrimaryGeneratedColumn() // Primary column
	@IsInt() // Validation - Value must be integer
	@BodyguardKey() // Authentication - User must match this to be considered "self"
	@AnyoneCanRead() // Authorization - Anyone is allowed to read this field
	public id: number = undefined;

	// Username
	@Column({ unique: true }) // Database column - Usernames are unique
	@IsAlphanumeric() // Validation - must be alphanumeric
	@Length(4, 16) // Validation - must be between 4-16 characters
	@AnyoneCanRead() // Authentication - Anyone has read privelege to this member
	@OnlySelfCanWrite() // Authorization - Only self can write this member
	public username: string = undefined;

	// Password
	@Column() // Database column
	@OnlySelfCanWrite() // Authentication - Only self can write this member
	// No read key - nobody can read this field
	public password: string = undefined;

	/**
	 * hashPassword
	 */
	public hashPassword() {
		if (this.password) {
			this.password = hashSync(this.password, 12);
		}
	}

	/**
	 * Hash the user's password before post
	 */
	public async beforePost(request: Request, response: Response) {
		this.hashPassword();

		return true;
	}

	/**
	 * Hash the user's password on update
	 */
	public async beforePatch(request: Request, response: Response) {
		this.hashPassword();

		return true;
	}
}
```

You can check out more sample models in `examples/`, or read more about them in the `Models` documentation.

### Routes

Routes are Express routes which chain together PointyAPI middleware functions. Here's an example User router:

```typescript
const router: Router = Router();

/**
 * Load model into PointyAPI
 */
async function loader(request, response, next) {
	if (await setModel(request, response, User)) {
		next();
	}
}

// POST - Load model, filter members, and save
router.post('/', loader, postFilter, postEndpoint);

// GET - Load model, filter members, and send
router.get('/', loader, getFilter, getEndpoint);

// PATCH - Load model, check if user owns, filter members, and save
router.patch(`/:id`, loader, onlySelf, patchFilter, patchEndpoint);

// DELETE - Load model, check if user owns, and delete
router.delete(`/:id`, loader, onlySelf, deleteEndpoint);

export const userRouter: Router = router;
```

## Getting Started

### Prerequisites
 - NodeJS
 - Database (Postgres Recommended)
 - HTTP Testing Client (Postman, cUrl, etc)
 - TS-Node
  - `npm i -g ts-node`

### Install

Create a folder for your project, and run these commands:

```
cd my-project
npm init -y
npm i pointyapi
```

### Create project
1. **Create a source directory, `src`**
2. **Inside `src/`, create a file `index.ts`**

	```typescript
	// src/index.ts

	import { pointy, bootstrap, log } from 'pointyapi';
	import { basicCors, loadUser } from 'pointyapi/middleware';

	// Routes
	// TODO: We will import routes here

	// Setup
	pointy.before = async (app) => {
		// CORS
		app.use(basicCors);

		// Load user
		app.use(loadUser);

		// Routes
		// TODO: We will set our routes here

		// Database
		await pointy.db
			.setEntities(
				[
					/* TODO: We will set our models here */
					ExampleUser
				]
			)
			.connect()
			.catch((error) => pointy.error(error));
	};

	// Start the server!
	bootstrap(async () => await pointy.start());
	```
3. **Create a user route**
  
	By default, PointyAPI will use `ExampleUser` as the user model. Let's create a route for this model, so that we can access this model through our API:
   - Create a folder for routes, `src/routes/`
   - Create a new router file, `src/routes/user.ts`
   - Copy & paste router code:

	```typescript
	// src/routes/user.ts

	import { Router } from 'express';
	import { setModel } from 'pointyapi';
	import { ExampleUser } from 'pointyapi/models';
	import { postFilter, getFilter, patchFilter } from 'pointyapi/filters';
	import { onlySelf } from 'pointyapi/guards';
	import {
		getEndpoint,
		postEndpoint,
		patchEndpoint,
		deleteEndpoint
	} from 'pointyapi/endpoints';

	const router: Router = Router();

	// Set the route model to ExampleUser
	async function loader(request, response, next) {
		if (await setModel(request, response, ExampleUser)) {
			next();
		}
	}

	// Route endpoints
	router.get('/', loader, getFilter, getEndpoint);
	router.post('/', loader, postFilter, postEndpoint);
	router.patch(`/:id`, loader, onlySelf, patchFilter, patchEndpoint);
	router.delete(`/:id`, loader, onlySelf, deleteEndpoint);

	export const userRouter: Router = router;
	```

4. **Import user route into server**

	Open `src/index.ts` up again, and let's import our new User route.

	```typescript
	import { ExampleUser } from 'pointyapi/models'; // Add import to our user model

	...
	// Routes
	// TODO: We will import routes here
	import { userRouter } from './routes/user'; // Add import to our user route

	...
	
	// Routes
	// TODO: We will set our routes here
	app.use('/api/v1/user', userRouter); // Add our user route to the app

	// Database
	await pointy.db
		.setEntities(
			[
				/* TODO: We will set our models here */
				ExampleUser // Add our BaseModel model to the database
			]
		)

	...
	```

5. **Setup package.json**

	Add a start script to `package.json`:

	```json
	"scripts": {
		"start": "ts-node src/index.ts"
	}
	```

6. **Setup database**

	Create a database, create a `.env` file in the root folder of your app, and replace the values:

	```env
	POINTYAPI_DB_NAME=pointyapi
	POINTYAPI_DB_TYPE=postgres
	POINTYAPI_DB_HOST=localhost
	POINTYAPI_DB_PORT=5432
	POINTYAPI_DB_USER=pointyapi
	POINTYAPI_DB_PASS=password1234
	```

7. **Start & Test**

	Our server is ready to run:

	```
	npm start
	```

	Open Postman, and send a GET request for all users. You'll see the result as an empty array, as there are no users yet:
	![postman](https://github.com/StatelessStudio/pointyapi/blob/master/readme/img/step7.JPG "Postman GET Request")

	Create a user:

	We'll send a POST request to `/api/v1/user`, with the JSON body of our new user
	![postman](https://github.com/StatelessStudio/pointyapi/blob/master/readme/img/step7b.JPG "Postman POST Request")

	Let's get all users again:
	![postman](https://github.com/StatelessStudio/pointyapi/blob/master/readme/img/step7c.JPG "Postman GET Request")

	You can see that now a get request for all users produces an array of our one user.

8. **Authentication**

	So we can get and post users, but what if we try to delete or update a user? Let's try it:
	![postman](https://github.com/StatelessStudio/pointyapi/blob/master/readme/img/step8.JPG "Postman DELETE Request")

	So the server responded with `401 Unauthorized`, and a body of `"not self"`. What gives?

	Open at our user router (`/src/routes/user.ts`). Look at our DELETE route:

	```typescript
	router.delete(`/:id`, loader, onlySelf, deleteEndpoint);
	```

	Notice `onlySelf` - that means only the user can access this route. We're not logged in yet, so we're certainly not "self"

	Create another router file, `src/routes/auth.ts`. This will be our authentication route so that we can log-in.

	```typescript
	// src/routes/auth.ts

	import { Router } from 'express';
	import { loginEndpoint, logoutEndpoint } from 'pointyapi/endpoints';
	import { ExampleUser } from 'pointyapi/models';
	import { setModel } from 'pointyapi';

	const router: Router = Router();

	// Set our route model & activate auth route
	async function loader(request, response, next) {
		if (await setModel(request, response, ExampleUser, true)) {
			next();
		}
	}

	// Router endpoints
	router.post('/', loader, loginEndpoint);
	router.delete('/', loader, logoutEndpoint);

	export const authRouter: Router = router;
	```

	And import this into our `index.ts`:

	```typescript
	...
	// Routes
	// TODO: We will import routes here
	import { userRouter } from './routes/user';
	import { authRouter } from './routes/auth'; // Add import to our auth route

	...
	
	// Routes
	// TODO: We will set our routes here
	app.use('/api/v1/user', userRouter);
	app.use('/api/v1/auth', authRouter); // Add our user route to the app

	// Database
	await pointy.db
		.setEntities(
			[
				/* TODO: We will set our models here */
				ExampleUser
			]
		)

	...
	```

	Restart the server (ctrl+c to stop the server)

	We can login with Postman:
	![postman](https://github.com/StatelessStudio/pointyapi/blob/master/readme/img/step8b.JPG "Postman Login Request")

	We received a "token" back (yours will be different):
	```json
	"token": "ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2TVN3aWFXRjBJam94TlRVeE1qa3dOREkxTENKbGVIQWlPakUxTlRFek1EUTRNalY5Lk40UWNJV1hPYWVzWW9KOWh4VGx1X182dnhNVndpbkFXNGhRY2JWNkRKSUE="
	```

	We can now use that token to delete our user:
	![postman](https://github.com/StatelessStudio/pointyapi/blob/master/readme/img/step8c.JPG "Postman DELETE Request")

	Notice that now we get a `204 No Content` (which means deleted successfully!).

	**What about the refreshToken?**
	You may notice you got two tokens back: `token` and `refreshToken`.

	The `token` is short-lived - it only lasts 15 minutes or so.
	The `refreshToken` is long-living - it lasts about a week.

	You can use the `refreshToken` to issue a new `accessToken` when it expires.

9. **Production**

To launch in production mode, please make sure the following variables are set (environment variables/.env)

- **SITE_TITLE** - Set the site title
- **ALLOW_ORIGIN** - Set your client URL to add the client to the CORS policy
- **JWT_KEY** - Set your token key to make JWT cryptographically secure
- **JWT_TTL** - Set your token time-to-live (seconds). Default is 15 minutes
- **JWT_REFRESH_TTL** - Set your refresh token time-to-live (seconds). Default is 7 days.

#### UUID vs Auto-Incremented IDs

It is a security risk to use auto-incremented IDs, and you should instead use UUID for all ID columns.

To switch to using UUIDs:

- Install the `pgcrypto` extension
- Tell TypeORM to use pgcrypto by placing the line `uuidExtension: 'pgcrypto'` in `orm-cli.js`
- Change all `PrimaryGeneratedColumn()` to `PrimaryGeneratedColumn('uuid')`
- Change all `public id: number` members to `public id: string`
- Make sure you remove `IsInt()` from all ID fields, if it exists
- Ensure your front-end and anywhere you may access the ID is expecting a string

Example:
```typescript
	// User ID
	@PrimaryGeneratedColumn('uuid') // Primary column
	@BodyguardKey() // Authentication - User must match this to be considered "self"
	@AnyoneCanRead() // Authorization - Anyone is allowed to read this field
	public id: string = undefined;
```

### Logger

PointyAPI uses ts-tiny-logger.

#### Using the Log

```typescript
import { log } from 'pointyapi';

log.fatal('Oh no!', { someData: 'foo' });
log.error('Error!', new Error());
log.warn('Warning!', 1234);
log.info('Information!', 'Hello!');
log.debug('Debugging...', { someData: 'bar' });
```

#### Setting the Log

```typescript
import { setLog } from 'pointyapi/log';
import { Log } from 'ts-tiny-log';
import { LogLevel } from 'ts-tiny-log/levels';

setLog(new Log({
	level: LogLevel.info,
}));
```

### Continued Reading

#### PointyAPI

Read more about PointyAPI by cloning the repository and building the docs:

```
git clone https://github.com/StatelessStudio/pointyapi
cd pointyapi
npm install --ignore-scripts
npm i -g typedoc
npm run docs
```

Now open `docs/index.html` in your web browser.

You can also check out the examples in `test/examples` and even check out the test specs in `test/specs`

#### TypeORM

Read more about TypeORM: https://github.com/typeorm/typeorm

#### Class Validator

Read more about Class Validator: https://github.com/typestack/class-validator

#### Express

Read more about Express: https://www.express.com/

#### Securing your Server

Read the security checklist: https://github.com/shieldfy/API-Security-Checklist
