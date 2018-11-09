# PointyApi Changelog

## [0.1.1] Nov-09-2014 - HttpClient & BaseModel Bugfixes

Fixed HttpClient stringizing bodies, and added constrcutor to BaseModel to set ID

### Fixes

- Added constructor to BaseModel class to set id
- Removed strict-type from BaseModel id
- [HttpClient] Use body instead of encoded form
- [HttpClient] Set post/put content-type to JSON

## [0.1.0] Nov-04-2014 - Guards & Filters

Created guards and filters to assist in authentication/authorization, as well as many bugfixes and minor enhancements.

### Additions

 - Created guards:
	- onlyActive
	- onlyAdmin
	- onlyMember
	- onlySelf
	- onlyUser
 - Created filters:
	- deleteFilter
	- getFilter
	- postFilter
	- putFilter
 - Created examples:
	- Guards
	- Chat
 - Created hooks:
	- beforeLoadPost
	- beforeLoadGet
	- beforeLoadPut
	- beforeLoadDelete
	- beforeLogin
	- beforePost
	- beforeGet
	- beforePut
	- beforeDelete
 - Created endpoint:
	- logout
 - Created bodyguard functions:
	- writeFilter()
	- responseFilter()
 - setModel() automatically loads request.payload

### Fixes

 - Fixed issues causing wrong or multiple response headers
 - Addressed canRead, canWrite, isSelf object type issues
 - Async/Await upgradeUserRole()
 - JSON.stringify() test-suite errors for verbose logging
 - Fixed and cleaned up test suites

## [0.0.2] Nov-01-2018 - Auto-Load

SetModel automatically runs getQuery or loadEntity.

### Fixes

 - setModel() should load paylaod
 - Endpoints merge object
 - Removed async/await with then()
 - Removed forkServer() test from api
 - setModel() should return if headers were sent
 - Delete endpoint should run on request.payload
 - Hooks should not be async/await
 - Updated BaseUser hook names
 - loadEntity() uses getIdentifierValue()
 - Removed hooks from BaseModel
 - Created seperate jasmine config files

## [0.0.1] Oct-31-2018 - Initial Release

Initial Release
