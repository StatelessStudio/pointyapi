import * as path from 'path';
import { existsSync, copyFileSync } from 'fs';

export type BundleFunction = (filename, outdir) => void;
export type BundleMap = Record<string, boolean|string|BundleFunction>;

/**
 * Bundle the project files
 * 
 * @param files Bundle map
 * @param outdir Output directory path (relative)
 */
export async function bundle(files: BundleMap, outdir: string): Promise<void>
{
	console.log('p Bundling...');

	for (const filename in files) {
		const value: boolean|string|BundleFunction = files[filename];
		let outputFile = null;

		if (typeof value === 'string') {
			outputFile = path.join(outdir, value);
		}
		else if (value === true) {
			outputFile = path.join(outdir, filename);
		}
		else if (value instanceof Function) {
			console.log('Running callback for "' + filename + '"');
			value(filename, outdir);
		}

		if (outputFile) {
			if (!existsSync(filename)) {
				throw new Error('File "' + filename + '" not found!');
			}

			console.log('Copy "' + filename + '" to "' + outputFile + '"');
			copyFileSync(filename, outputFile);
		}
	}
};
