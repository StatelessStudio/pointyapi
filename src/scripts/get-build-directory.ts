import { join as joinPath } from 'path';

/**
 * Get the build directory from a tsconfig file
 * 
 * @param tsconfig TSConfig file name
 * @returns Returns the build directory
 */
export function getBuildDirectory(tsconfig: string): string {
	const config = require(joinPath(process.cwd(), tsconfig));
	const outdir = config?.compilerOptions?.outDir;

	if (!outdir) {
		throw new Error('Could not get output directory');
	}

	return outdir;
}
