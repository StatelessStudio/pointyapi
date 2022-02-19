#!/bin/bash
npm test
npm run build:prod
ts-packager
cd dist/src/
npm publish
