# PointyApi Changelog

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
