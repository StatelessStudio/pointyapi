import * as dotenv from 'dotenv';
const envfile = dotenv.config();

/**
 * Environment Variables Schema
 */
export interface Environment {
	APP_TITLE: string
}

/**
 * Default Values
 */
const defaults: Environment = {
	APP_TITLE: 'MY_APP'
};

// Export
export const env: Environment = Object.assign(defaults, envfile.parsed);
