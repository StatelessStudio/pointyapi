import { bootstrap, bundlePackageJson, bundle } from '../src/scripts';
import { BundleMap } from '../src/scripts/bundle';
import { config } from './_config';

const files: BundleMap = {
	'CHANGELOG.md': true,
	'LICENSE.md': true,
	'README.md': true,
	'package.json': bundlePackageJson
};

bootstrap(bundle(files, config.buildDir));
