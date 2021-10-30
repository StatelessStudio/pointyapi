import { Config, BundleMap, bundlePackageJson } from 'ts-packager';

export const config: Config = {
	buildDir: 'dist/src/'
};

export const files: BundleMap = {
	'CHANGELOG.md': true,
	'LICENSE.md': true,
	'README.md': true,
	'package.json': bundlePackageJson
};
