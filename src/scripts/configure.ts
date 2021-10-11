import { getBuildDirectory } from './get-build-directory';

/**
 * Script options
 */
export interface ScriptOptions
{
	tsconfig?: string;
}

/**
 * Script configuration
 */
export interface ScriptConfig extends ScriptOptions
{
	buildDir: string;
}

/**
 * Configure settings
 * 
 * @param config Script options
 * @returns Completed script configuration
 */
export function configure(config: ScriptOptions): ScriptConfig {
	const tsconfig = config.tsconfig ?? 'tsconfig.json';

	return {
		tsconfig: tsconfig,
		buildDir: getBuildDirectory(tsconfig)
	};
}
