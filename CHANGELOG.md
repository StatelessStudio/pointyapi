# PointyApi Changelog

## [3.0.0] Jun-20-2019

### Breaking Changes (See migration.md)
- [Issue #179] Swap http expect & token param
- Removed database error handler
- Changed `refreshToken` to `__refreshToken` in post endpoints
- Changed `CLIENT_URL` to `ALLOW_ORIGIN`

### Additions
- Added jwtBearer::sign argument
- Added pointy::testmode
- Added new ipc message test
- Added ExampleUser class
- Added ready-check prior to starting server
- Added BaseDb::conn
- Moved Postgres members to BaseDB

### Fixes
- Error handling
- Fixed a bug which mixed up `JWT_TTL` and `JWT_REFRESH_TTL`
- runHook should log error
- patchEndpoint should merge payload after patch hook
- Login endpoint should check validation
- npm update
- Simplified login endpoint
- Fixed default entities bug
- Moved "server-ready" ipc from listen() to pointy::start()

## [2.0.0] Jun-06-2019

### Breaking Changes (See migration.md)

- [Issue #167] Auth token should remain stateless
- [Issue #170] Guards should use forbiddenResponder instead of unauthorizedResponder
- [Issue #174] Don't use auto-increment id
- [Issue #175] Issue refresh tokens

### Additions

- [Issue #93] Add security checks to test-suite
- [Issue #168] Add pointy.ready hook to fire when server is listening
- [Issue #169] CORS function should utilize process.env.CLIENT_URL
- [Issue #173] Package.json should include repository info

### Fixes

- npm update
- Removed typedoc from dependencies
- [Issue #165] loadUser() should use uniform Could not/Couldn't
- [Issue #166] validationResponder() "Not null violation" should specify field name
- [Issue #171] Http expect should accept success codes
- [Issue #172] [README] Misidentifies Authentication/Authorization

## [1.2.4] May-29-2019

### Fixes

- [Issue #163] Remove SESS_KEY & SESS_TTL environment variables
- [Issue #162] HttpClient::port should accept number or string

## [1.2.3] May-07-2019

### Fixes

- npm update
- [Issue #149] Boolean model members don't save properly
- [Issue #155] Search query should be case-insensitive
- [Issue #157] Remove database credentials from log
- [Issue #160] Update coveralls branch

## [1.2.2] Mar-14-2019

### Fixes

- [Issue #153] runHook beforePatch must set model type

## [1.2.1] Mar-11-2019

### Fixes

- [Issue #151] loginEndpoint() allows tempPassword
- [Issue #150] loginEndpoint does not try tempEmail

## [1.2.0] Mar-08-2019

### Additions

- [Issue #147] Add after hooks

### Fixes

- Cleaned up getReadable functions
- [Issue #146] setModel() doesn't load not owned objects

## [1.1.2] Mar-05-2019

### Fixes
- Removed JoinColumn() from Term author
- [Issue #144] readFilter() detypes nested arrays of objects

## [1.1.1] Mar-04-2019

### Fixes
- Added CanReadRelation() on Term end of termRelations
- Removed AnyoneCanRead() from User termRelations
- Removed select query from Term relationship test
- Added get one test to Term relationship test suite

## [1.1.0] Mar-04-2019

### Additions
- Added many-to-many terms example

## [1.0.0] Feb-27-2019

First major release.  View the migration guide: ([MIGRATION GUIDE](https://github.com/StatelessStudio/pointyapi/blob/master/migration.md))

### Breaking Changes
- [Issue #78] Removed response parameter from responder functions
- [Issue #78] Handlers & Responder functions are now bound to { request, response }
- [Issue #79] Hooks are now async functions
- [Issue #80] Renamed model hooks (view migration guide)
- [Issue #84] Normalized responder messages
- [Issue #100] setModel() return value must be checked
- [Issue #104] Removed onGetQuery() hook
- [Issue #101] Swap runHook() parameters
- [Issue #110] Reoved deleteFilter
- [Issue #116] Create util directory
- [Issue #124] Model hooks should refer to `this.` rather than `request.`
- [Issue #125] Cleanup json-search protocol
- [Issue #126] GET Query no longer requires `search` key
- [Issue #128] Remove beforeGet() hook
- [Issue #130] before*() hooks should run after entity is loaded
- [Issue #131] PUT should be replaced by PATCH
- [Issue #137] Reorganized folder structure
- [Issue #138] Created BodyguardOwner enum
- Login endpoint calls unauthorizedResponder() instead of goneResponder()
- Renamed responseFilter to readFilter
- Moved isAdmin and isSelf to utils
- Moved isKeyInModel() to utils

### Additions
- [Issue #86] Added documentation
- [Issue #91] Added code coverage reporting
- Added bindResponders() function
- Added PointyPostgress::connectionName
- Added createMockRequest() for testing
- Added @CanReadRelation() decorator and getReadableRelations()
- [Issue #97]Added community standards file
- [Issue #106] Added select query key
- [Issue #107] Add raw query key
- [Issue #118] Add function to add default users/resources
- [Issue #121] Add query validator
- [Issue #139] Added additionalParameters to query types

### Fixes
- Linting
- Updated test output directory
- Optimizations
- npm update
- Fixed doc gen errors
- Completed test coverage
- Updated doc blocks
- [Issue #85] Responders must terminate request
- [Issue #89] Post should remove undefined members
- [Issue #90] Add CORS haders to basicCors()
- [Issue #92] Cleanup test-suite
- [Issue #99] Group by test does not expect proper value
- [Issue #103] setModel() should check results of loadEntity() and getQuery()
- [Issue #105] getQuery().then() should not respond with error if headers already sent
- [Issue #108] Group by should not append ID indefinitely
- [Issue #109] Group By must use getRaw()
- [Issue #111] onlyMember() should allow admins
- [Issue #122] join should join all applicable embers
- [Issue #127] setModel must Promise.all hooks
- [Issue #132] GET query search by object
- [Issue #133] getQuery() refers to 'obj' instead of objAlias
- [Issue #134] All types in getQuery should check if the field is readable
- [Issue #140] Could not complete hook should be more descriptive
- Admins can read Bodyguard.Self keys
- Fixed `statusCode of undefined` error
- Listen function should not throw errors
- writeFilter() can take array of objects
- postFilter() can assume method is post
- onlySelf() should not return a promis
- Fork server should reject if the file is not accessible
- Exported JwtBearer class to create instances in user-space
- Changed "Invalid query parameters" error message to "Invalid request parameters"
- Only run logout endpoint if user is authenticated

## [0.6.1] Jan-24-2019

Fixed packaging error on last release

## [0.6.0] Jan-24-2019

### Additions
- Added MIT License
- Added Contributing guide
- Added pull-request template
- Added issue templates

## [0.5.3] Jan-02-2019

### Fixes
- [Issue #75] Login endpoint should run responseFilter() as newly logged in user
- [Issue #76] Validation filter fails when trying to clear an existing field with empty string

## [0.5.2] Dec-31-2018

### Fixes
- [Issue #73] Object alias should be prepended to order by key regardless of joins

## [0.5.1] Dec-31-2018

### Fixes
- [Issue #71] Object alias (mnemonic) must be prepended if join tables exist, but this field isn't from a join

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
