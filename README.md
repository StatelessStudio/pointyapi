# typescript-template

## Installation

1. Fork this repo
2. Replace "typescript-template" with the name of your app project-wide (**No Spaces or special characters except dash!**)
3. `npm i`
4. Update the documentation, changelog, etc

## Development

Run a dev test with `npm start`

## Running Tests

To run unit tests, `npm run test`

## Compiling

### Debug Builds

To compile a debug build, run `npm run build:dev`. The build output will appear in the `./dist` folder.

### Prod Builds

To compile a production build, run `npm run build:prod`. The build output will appear in the `./dist` folder.

### Clean Builds

To generate a clean build (removes old artifacts and reruns pre&post process scripts), append `:clean` to a build script:
- Debug: `npm run build:dev:clean`
- Release: `npm run build:prod:clean`

## More

### Generating Docs

`npm run doc` and browse docs/index.html!

### Environment Variables

Environment variables should be set in .env

To add additional environment variables, edit `src/environment.ts`:

```typescript
/**
 * Environment Variables Schema
 */
export interface Environment {
	APP_TITLE: string

	// TODO: Add additional allowed variables
}

/**
 * Default Values
 */
const defaults: Environment = {
	APP_TITLE: 'MY_APP'

	// TODO: Set default variables here
};
```

You'll now have editor hints on environment variables:

![Screenshot](doc/image/environment-1.png)

and type-checking:

![Screenshot](doc/image/environment-2.png)

