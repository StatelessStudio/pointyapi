#!/bin/bash
npm test
npm run build:prod
cd dist/src/
npm publish
