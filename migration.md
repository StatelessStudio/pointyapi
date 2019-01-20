# Migration Guide

## Version 0.x.x -> 1.x.x

1. Remove `response` parameter from responders and handlers
	Responders and handlers no longer take a `response` parameter, so you just need to remove the parameter from all calls to the following functions.  This is easiest via find and replace (pro tip: use regex!)
	- `response.error()`
	- `response.conflict()`
	- `response.delete()`
	- `response.forbidden()`
	- `response.get()`
	- `response.gone()`
	- `response.post()`
	- `response.put()`
	- `response.unauthorized()`
	- `response.validation()`
2. Rename hooks
	Hooks have been renamed for clarity.  Rename all hooks in your models (pro tip: project-wide find & replace).  **Make sure you go in order, and replace all occourences before moving on, because some hook names conflict with old hook names!**
    - `beforePost()` -> `post()`
    - `beforePut()` -> `put()`
    - `beforeGet()` -> `get()`
    - `beforeDelete()` -> `delete()`
    - `beforeLogin()` -> `login()`
    - `beforeLogout()` -> `logout()`
    - `beforeLoadPost()` -> `beforePost()`
    - `beforeLoadPut()` -> `beforePut()`
    - `beforeLoadGet()` -> `beforeGet()`
    - `beforeLoadDelete()` -> `beforeDelete()`
    - `onGetQuery()` -> `preload()`