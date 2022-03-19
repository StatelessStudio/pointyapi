import { AppConfig, configure } from 'ts-appconfig';

/**
 * Environment Variables Schema
 */
export class PointyEnvironment extends AppConfig {
	readonly APP_TITLE = 'pointyapi';

	readonly PORT = 8080;

	readonly ALLOW_ORIGIN: string;
	readonly JWT_KEY = 'dev_key';
	readonly JWT_ACCESS_TTL = 15 * 60; // 15 minute access
	readonly JWT_REFRESH_TTL = 7 * 24 * 60 * 60; // 7 day refresh

	readonly DATABASE_URL: string;
}

/**
 * Load & export environment variables
 */
export const env: PointyEnvironment = configure(PointyEnvironment);
