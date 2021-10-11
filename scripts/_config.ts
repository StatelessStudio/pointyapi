import { configure} from '../src/scripts';
import { ScriptConfig } from '../src/scripts/configure';

/**
 * Script Configuration
 */
export const config: ScriptConfig = configure({
	tsconfig: 'tsconfig.dist.json'
});
