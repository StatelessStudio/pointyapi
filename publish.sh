#!/bin/bash
npm test
npm run build:prod
node_modules/.bin/ts-packager
cd dist/src/
npm publish
