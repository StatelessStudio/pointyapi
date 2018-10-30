# pointy
Opinionated Restful Server Architecture

## Installation

```
npm init
npm i StatelessStudio/pointy#v0.0.1 express @types/node @types/express
```

## Typescript setup

`package.json`
```json
	"scripts": {
		"build": "tsc --p tsconfig.json",
		"build:spec": "tsc --p tsconfig.spec.json",
		"lint": "tslint --project tslint.json",
		"start": "npm run build && node dist/src/server.js",
		"test": "npm run build && npm run build:spec && npm run db:drop && npm run test:jasmine",
		"test:jasmine": "jasmine --config=jasmine.json",
		"db:drop": "typeorm schema:drop -f orm-cli",
		"postinstall": "npm run build"
	}
```

- Copy the npm scripts
- Copy `tsconfig.json`, `tsconfig.spec.json`, and `tslint.json` to your project root

## VsCode Setup

Setup debugging

`.vscode/launch.json`
```json

	"configurations": [
		{
			"type": "node",
			"request": "launch",
			"name": "Launch Program",
			"runtimeArgs": ["-r", "ts-node/register"],
			"args": ["${workspaceFolder}/src/server.ts"],
			"preLaunchTask": "npm: build"
		}
	]
```
