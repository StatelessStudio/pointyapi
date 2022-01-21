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

## Scripts

You can write custom scripts in the `scripts/` directory. See `scripts/example.ts` as an example. You should also register your scripts in `package.json`:

```json
{
	...
	"scripts": {
		...
		"admin:example": "ts-node scripts/example"
	}
}
```

Run your script with `

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

See `src/environment.ts` to see how to use this project's environment variables. Configure an environment in `.env` or with `process.env` (https://nodejs.org/dist/latest-v16.x/docs/api/process.html#processenv).
