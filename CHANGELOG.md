# PointyApi Changelog

## [0.5.0] Dec-31-2018

Created `CanSearchRelation()` decorator and fixed relation search bugs

### Additions
- Created `CanSearchRelation()` ([Issue #68] Must be able to search by joined columns)

### Fixes
- [Issue #67] GET query fails on order by joined column
- [Issue #66] GET query must query by bodyguard keys, unless user is admin

## [0.4.2] Dec-26-2018

Fixed onlySelf() on GET

### Fixes
- onlySelf() on GET should not be authorized by default
- onlySelf() should filter GET arrays

## [0.4.1] Dec-23-2018

Fixed count parameter

### Fixes
- Fixed Count parameter to work with joins and filters

## [0.4.0] Dec-21-2018

Added `__count` key and issue 409 on foreign key violation

### Additions
- Added handler for foreign key violations
- Added `__count` key

### Fixes
- [Issue #59] - Bodyguard cannot read property 'id' of null

## [0.3.1] Dec-02-2018 - Minor Bugfixes

Fixed JWT Token expiration & __orderBy

### Fixes
- [Issue #57] __orderBy should prepend 'obj' to column name
- [Issue #56] JWT Expiration is in milliseconds rather than seconds

## [0.3.0] Dec-01-2018 - Search Update

Added options to GET search, fixed filters, and return expiration with token.

### Additions
- [Issue #54] Add "not" special key
- [Issue #53] Add less than/greater than operator special keys
- [Issue #52] Add groupBy special key
- [Issue #49] Add "offset" special key
- [Issue #48] Add "limit" special key"
- [Issue #47] Add "between" special key
- [Issue #46] Add "order by" speial key
- [Issue #45] loginEndpoint should return token expiration
- Created JwtBearer()::getExpiration()
- Created getReadbleFields() test spec

### Fixes
- Changed default token expiration to 4 hours
- [Issue #51] isSelf() must check objBodyguardKeys and userBodyguardKeys seperately
- [Issue #50] __search should not check length of search string
- [Issue #17] - GET Endpoint filter doesn't filter nested objects

## [0.2.1] Nov-23-2018 - POST update

### Fixes
- [Issue #41] getBodyguardKeys() should not fail on error
- [Issue #39] POST endpoint should return the entire object, through responseFilter()
- [Issue #18] Accept array on POST instead of requiring multiple requests
- [Issue #40] loginEndpoint should return filtered user object

## [0.2.0] Nov-17-2018 - Joins, Search, Security, & Bugfixes

- Node update
- Added `__search` to Get query
- Added `__join` to Get query
- Added `__whereAnyOf` to Get query
- Added ISO time functions
- Added test probe middleware
	- coreTestProbe
	- userTestProbe
	- requestTestProbe
- Created `getReadableFields()`
- Changed timeAccessed to timeUpdated
- Bugfixes

### Additions

- [Issue #16] Create UpdateTimestamp key to automate timeAccessed / timeUpdated
- [Issue #21] Add `__join` special key to GET
- [Issue #24] Get Query should allow `__search` with other parameters
- [Issue #25] Update to Node 10
- [Issue #27] Add TestProbe middleware
- [Issue #28] Add special key `__whereAnOf` to GET query for OR instead of AND
- Created getReadableFields()
- Created getISOTime()

### Fixes
- [Issue #17] GET Endpoint filter doesn't filter nested objects
- [Issue #19] - Should return 400 instead of 403 if member key does not exist
- [Issue #20] - Change "search" query key to "__search"
- [Issue #22] - Change login endpoint "user" key to special key "__user"
- [Issue #23] POST / PUT forbidden when underscored member has no read/write keys
- [Issue #26] Check that request.payload is not being used in Object context
- [Issue #30] [Jasmine] Cannot read 'statusCode' of undefined
- GET query without identifier should pass onlySelf()
- Updated timeAccesed to timeUpdated
- Added request.userType to createMockup()

## [0.1.1] Nov-09-2018 - HttpClient & BaseModel Bugfixes

Fixed HttpClient stringizing bodies, and added constrcutor to BaseModel to set ID

### Fixes

- Added constructor to BaseModel class to set id
- Removed strict-type from BaseModel id
- [HttpClient] Use body instead of encoded form
- [HttpClient] Set post/put content-type to JSON

## [0.1.0] Nov-04-2018 - Guards & Filters

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
