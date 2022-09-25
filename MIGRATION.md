# Migration Guide

## What version do you have?
> Choose the version you have before upgrading, and follow the guide to the bottom from there.
- [Migration Guide](#migration-guide)
	- [What version do you have?](#what-version-do-you-have)
	- [Version 0.x.x -> 1.x.x](#version-0xx---1xx)
	- [Version 1.x.x -> 2.x.x](#version-1xx---2xx)
	- [Version 2.x.x -> 3.x.x](#version-2xx---3xx)
	- [Version 3.x.x -> 4.x.x](#version-3xx---4xx)

## Version 0.x.x -> 1.x.x

1. Remove `response` parameter from responders and handlers
	Responders and handlers no longer take a `response` parameter, so you just need to remove the parameter from all calls to the following functions. This is easiest via find and replace (pro tip: use regex!)
	- `response.error()`
	- `response.conflictResponder()`
	- `response.deleteResponder()`
	- `response.forbiddenResponder()`
	- `response.getResponder()`
	- `response.goneResponder()`
	- `response.postResponder()`
	- `response.putResponder()`
	- `response.unauthorizedResponder()`
	- `response.validationResponder()`
2. Rename hooks
	Hooks have been renamed for clarity. Rename all hooks in your models (pro tip: project-wide find & replace). **Make sure you go in order, and replace all occourences before moving on, because some hook names conflict with old hook names!**
    - `beforePut()` -> `beforePatch()`
    - `beforeGet()` -> REMOVED
    - `beforeDelete()` -> `delete()`
    - `beforeLoadPost()` -> `beforePost()`
    - `beforeLoadPut()` -> `beforePatch()`
    - `beforeLoadGet()` -> REMOVED
    - `beforeLoadDelete()` -> `beforeDelete()`
    - `onGetQuery()` -> REMOVED
    - `put()` -> `patch()`
3. Check `setModel()` return value
	Ensure you wrap setModel() in an if statement, and only proceed to next() if the function returns true

	```typescript
	// Set model
	router.use((request, response, next) => {
		if (await setModel(request, response, ExampleUser)) {
			// Note that this next() call is now in an if-statement around the setModel()
			next();
		}
	});
	```
4. Remove `deleteFilter`. This filter does not have any value
5. Update import directories
   - `/fork-server` -> `/utils`
   - `/get-identifier-value` -> `/utils`
   - `/listen` -> `/utils`
   - `/run-hooks` -> `/utils`
   - `/upgrade-user-role` -> `/utils`
6. Update `setModel()` for auth routers
	Previously, `setModel()` would run the incorrect hooks for auth routers, and may even lead to deleting the wrong user's token. This has been fixed by passing `true` to the fourth parameter (`isAuth`)

	```typescript
	// Set model
	router.use((request, response, next) => {
		//                                               vvv add this for auth routes
		if (await setModel(request, response, ExampleUser, true)) {
			// Note that this next() call is now in an if-statement around the setModel()
			next();
		}
	});
	```
7. Make sure all hooks are `async` functions
	Hooks must now be async functions. Search through hooks, and replace with `public async HOOK_NAME()`
8. Make sure hooks utilize this.
	Hooks are now bound to the resource, and should utilize `this.` notation
9. Make sure hooks don't loop
    Hooks are called once per object, therefore they should only take care of one resource at a time
11. Default resources can now be added via `addResource(User, {...})`
12. Update GET queries.
	GET queries have been reworked. The following field names have changed:
	- `__select` => `select`
	- `__whereAnyOf` => `whereAnyOf`
	- `__search` => `search`
	- `__not` => `not`
	- `__raw` => `raw`
	- `__join` => `join`
	- `__between` => `between`
	- `__lessThan` => `lessThan`
	- `__lessThanOrEqual` => `lessThanOrEqual`
	- `__greaterThan` => `greaterThan`
	- `__greaterThanOrEqual` => `greaterThanOrEqual`
	- `__groupBy` => `groupBy`
	- `__orderBy` => `orderBy`
	- `__limit` => `limit`
	- `__offset` => `offset`
	- `__count` => `count`

	Additionaly, WHERE fields should no longer be in the top-level of the query, and instead should be in the `where` query type
13. Change all PUT requests to PATCH
	- `putEndpoint` => `patchEndpoint`
	- `putFilter` => `patchFilter`
	- `putResponder` => `patchResponder`
	- `putEndpoint` => `patchEndpoint`
	- `http.put()` => `http.patch()`
	- `router.put()` => `router.patch()`
	- `PUT` => `PATCH`
14. Relations which will be queried must have `@CanReadRelation()` key
15. Update imports
	- Filters from `pointyapi/filters`
	- Guards from `pointyapi/guards`
16. Replace BodyguardOwner keys
	- `__anyone__` => BodyguardOwner.Anyone
	- `__self__` => BodyguardOwner.Self
	- `__admin__` => BodyguardOwner.Admin
17. Remove empty searches.
	Get queries no longer require a `search` key to access other query keys
18. All mdoel members must be initialized to undefined, including relational arrays
19. Queries may no longer pass special keys with `__` or `___`. You should now put these queries in the `additionalParameters` query object

## Version 1.x.x -> 2.x.x

1. Auth tokens are now completely stateless. Remove the `token` field from your User entity.
2. Login now issues a refresh token.
   1. Make a POST endpoint in your auth router:
		`router.post('/refresh', loader, refreshTokenEndpoint);` 
   2. Update your front-end auth refreshTokenservice to save the `refreshToken` and `refreshExpiration` from the `loginEndpoint`
   3. Set a timeout to call the `refreshTokenEndpoint` route when the access token expires. Setup the body like this: `{ __refreshToken: myRefreshToken }`. This will return an updated user object, including a new access token & expiration time.
3. **(Optional)** PointyAPI now supports `UUID`. Follow the steps in the Readme to enable UUID (strongly recommended for production).

   **NOTE** If you are already in production and decide to migrate to UUID, you must make sure to update relations etc

4. **(Optional)** Guards will now issue a `401` only if a token is not present/valid, otherwise will issue a `403`. This may help determine if the user is authenticated/authorized on the front-end.

## Version 2.x.x -> 3.x.x

1. If you use the PointyAPI HTTP Client, the functions have swapped the `bearer` and `expect` parameters. You must swap these in your code.
2. If your code uses a custom database error handler, this should be removed and the pointyapi error handler used instead.
3. `CLIENT_URL` is no longer used for CORS policy. Now you should use `ALLOW_ORIGINS`. **However, `CLIENT_URL` is still used for links, etc - so don't remove it**.
	Example:
	
	`/.env`
	```
	CLIENT_URL=http://example.com/
	ALLOW_ORIGINS=http://example.com/, http://cool-example.com/
	```

## Version 3.x.x -> 4.x.x

1. Now using node v16 and npm v8. Update your project accordingly
2. Now using class-validator v13.2.0. Update your project accordingly
3. Loading configuration from local.config.json has been deprecated. See readme to configure your environment.
4. Removed and replaced logging with ts-tiny-log. pointy.log and db.logger have been removed, and a global logger instance is used. See readme to use & configure logger.