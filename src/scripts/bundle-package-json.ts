import { join as joinPath } from 'path';
import { writeFileSync } from 'fs';

/**
 * Read the package file
 * 
 * @param filename package.json base name
 * @returns Returns the contents as an object
 */
export function readPackageJson(filename: string): Record<string, any>
{
	return require(joinPath(process.cwd(), filename));
}

/**
 * Write the package file
 * 
 * @param filename package.json base name
 * @param outdir Output directory path
 * @param data Contents as an object
 */
export function writePackageJson(
	filename: string,
	outdir: string,
	data: Record<string, any>
) {
	writeFileSync(
		joinPath(outdir, filename),
		JSON.stringify(data, null, '\t')
	);
}

/**
 * Bundle the package.json file
 * 
 * @param filename package.json file base name
 * @param outdir Output directory path
 */
export function bundlePackageJson(filename: string, outdir: string): void
{
	const pj = readPackageJson(filename);

	delete pj.private;
	pj.scripts = {};
	pj.devDependencies = {};
	pj.main = 'index.js';
	pj.types = 'index.d.ts'

	writePackageJson(filename, outdir, pj);
}
