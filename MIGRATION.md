# TypeScript Template Migration Guide

## What version do you have?
> Choose the version you have before upgrading, and follow the guide to the bottom from there.
- [Version 1.x.x](#version-1.x.x-->-2.x.x)

## Version 1.x.x -> 2.x.x

### Node version has upgraded to version 16

You should take care of any deprecation notices and fix any compilation errors. You must also update your environments to use Node 16 or greater

### Test spec files (*.spec.ts) have moved from `test/` to `test/spec/`

If you have any test files, you should run the command `git mv test/*.spec.ts test/spec/`

### The `logger.ts` file has been replaced

If you are using the logger file, you have some options:

1. **Refuse This Change** - Restore the `src/logger.ts` file and delete `src/log.ts`. You will also have to update any references and tests
2. **Use the new logger without updating references** - Rename `src/log.ts` to `src.logger.ts`, and change `export const log` to `export const logger`
3. **Upgrade** - If you would like to use the new logger, and update your application to use it, you will have to replace all references to `import { logger } from './logger';` to `import { log } from './log';`.