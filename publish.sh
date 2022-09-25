#!/bin/bash
npm run test:prod &&
node_modules/.bin/ts-packager &&
cd dist/src/ &&
npm publish