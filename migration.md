# Migration Guide

## Version 0.x.x -> 1.x.x

1. Remove `response` parameter from responders and handlers
	Responders and handlers no longer take a `response` parameter, so you just need to remove the parameter from all calls to the following functions.  This is easiest via find and replace (pro tip: use regex!)
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
	Hooks have been renamed for clarity.  Rename all hooks in your models (pro tip: project-wide find & replace).  **Make sure you go in order, and replace all occourences before moving on, because some hook names conflict with old hook names!**
    - `beforePost()` -> `post()`
    - `beforePut()` -> `patch()`
    - `beforeGet()` -> REMOVED
    - `beforeDelete()` -> `delete()`
    - `beforeLogin()` -> `login()`
    - `beforeLogout()` -> `logout()`
    - `beforeLoadPost()` -> `beforePost()`
    - `beforeLoadPut()` -> `beforePatch()`
    - `beforeLoadGet()` -> REMOVED
    - `beforeLoadDelete()` -> `beforeDelete()`
    - `onGetQuery()` -> REMOVED
3. Check `setModel()` return value
	Ensure you wrap setModel() in an if statement, and only proceed to next() if the function returns true

	```typescript
	// Set model
	router.use((request, response, next) => {
		if (await setModel(request, response, BaseUser)) {
			// Note that this next() call is now in an if-statement around the setModel()
			next();
		}
	});
	```
4. Remove `deleteFilter`.  This filter does not have any value
5. Update import directories
   - `/fork-server` -> `/utils`
   - `/get-identifier-value` -> `/utils`
   - `/listen` -> `/utils`
   - `/run-hooks` -> `/utils`
   - `/upgrade-user-role` -> `/utils`
6. Update `setModel()` for auth routers
	Previously, `setModel()` would run the incorrect hooks for auth routers, and may even lead to deleting the wrong user's token.  This has been fixed by passing `true` to the fourth parameter (`isAuth`)

	```typescript
	// Set model
	router.use((request, response, next) => {
		//                                               vvv add this for auth routes
		if (await setModel(request, response, BaseUser, true)) {
			// Note that this next() call is now in an if-statement around the setModel()
			next();
		}
	});
	```
7. Make sure all hooks are `async` functions
	Hooks must now be async functions.  Search through hooks, and replace with `public async HOOK_NAME()`
8. Make sure hooks utilize this.
	Hooks are now bound to the resource, and should utilize `this.` notation
9. Make sure hooks don't loop
    Hooks are called once per object, therefore they should only take care of one resource at a time
11. Default resources can now be added via `addResource(User, {...})`
12. Update GET queries
	GET queries have been reworked.  The following field names have changed:
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
	`putEndpoint` => `patchEndpoint`
	`putFilter` => `patchFilter`
	`putResponder` => `patchResponder`
	`putEndpoint` => `patchEndpoint`
14. Relations which will be queried must have `@CanReadRelation()` key
15. Update imports
	- Filters from `pointyapi/filters`
	- Guards from `pointyapi/guards`
  