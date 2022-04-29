# typescript-template#

## [2.1.0]

### Additions

### Fixes

## [2.0.1]

### Fixes
- [TSTEMPLATE-31] As a user, I should be able to reuse bootstrap options from scripts
- [TSTEMPLATE-30] Docs build is broken after upgrade of typedoc

## [v2.0.0]

### Breaking Changes
- [TSTEMPLATE-28] Move test specs to test/spec
- [TSTEMPLATE-25] Switch to ts-tiny-log
- [TSTEMPLATE-21] Upgrade to node v16

### Additions
- [TSTEMPLATE-27] Add script directory
- [TSTEMPLATE-26] Setup nodemon watch
- [TSTEMPLATE-24] Switch to ts-error-handler
- [TSTEMPLATE-23] Switch to ts-async-bootstrap
- [TSTEMPLATE-22] Switch from dotenv to ts-appconfig

### Fixes
- [TSTEMPLATE-20] Normalize project names
- [TSTEMPLATE-19] Add console warnings to dev lint settings, so that test logging doesn't stay until the end

## [v1.2.4]

### Fixes
- [TSTEMPLATE-18] Add instructions in readme that MY_APP replacement should not contain spaces
- [TSTEMPLATE-17] Environment file should merge declaration and definitions
- [TSTEMPLATE-16] Build should clear dist
- [TSTEMPLATE-15] Set no-empty eslint rule to warn instead of error
- [TSTEMPLATE-14] Remove tsconfig.spec.json
- [TSTEMPLATE-13] Switch tsconfig to output es6

## [v1.2.3]

### Fixes
- npm update

## [v1.2.2]

### Fixes
- [TSTEMPLATE-7] Source mapping references wrong line numbers when run in dev/ts-node
- [TSTEMPLATE-8] Set stack trace limit to Infinity
- [TSTEMPLATE-9] Filter stack traces for "just my code"
- [TSTEMPLATE-10] Remove webpack from default build-chain
- [TSTEMPLATE-11] Remove dist references from package.json
- [TSTEMPLATE-12] Add lint rule for unresolved promises

## [v1.2.1]

### Fixes
- [TSTEMPLATE-3][Docs] Typedoc --excludeNotExported switch is deprecated
- [TSTEMPLATE-4] Seperate index.ts from main.ts
- [TSTEMPLATE-5] Source mapping should be loaded before imports
- [TSTEMPLATE-6] main() entrypoint should have catch block

## [v1.2.0]

### Additions

- Add nodemon support
- Remove default pre&post process scripts
- Add :clean scripts for rebuilding

## [v1.1.0] - Jan-13-2021

### Additions

- Updated documentation for easier installation
- Add webpack build chain
- Add source mapping

### Fixes

- Move `main.ts` to `index.ts` to better meet node standard & to allow loading by directory with implicit entrypoint
- Max-line-length should be warning, not error
- [TSTEMPLATE-2] Environment doesn't infer type of export 'env'

## [v1.0.0] - Oct-15-2020

### Breaking Changes

- Switched from tslint to eslint due to deprecation

### Additions

- Add `npm start` script
- Add code coverage reporting and coveralls configuration
- Add additional prod linting

### Fixes

- Cleanup prettier config
- Added unit tests for untested code
- Linting should automatically fix
- Update readme code samples
- Add ts-project-version to package.json for version control
- Don't build on prepare hook

## [v0.0.0] - Oct-09-2020 - Initial Release

Initial Release
