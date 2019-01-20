# Migration Guide

## Version 0.x.x -> 1.x.x

1. Remove `response` parameter from:
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
