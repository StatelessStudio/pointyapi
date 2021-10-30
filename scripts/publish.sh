#!/bin/bash
npm test
npm run build
cd dist/src/
npm publish
