import { AppConfig, configure } from 'ts-appconfig';

export class DatabaseConfig extends AppConfig {
	readonly DATABASE_URL?: string;

	readonly POINTY_DB_SSL?: boolean;
	readonly POINTY_DB_NAME? = 'pointyapi';
	readonly POINTY_DB_TYPE? = 'postgres';
	readonly POINTY_DB_HOST? = 'localhost';
	readonly POINTY_DB_PORT? = 5432;
	readonly POINTY_DB_USER? = 'pointyapi';
	readonly POINTY_DB_PASS? = 'password1234';
}

/**
 * Environment Variables Schema
 */
export class Environment extends DatabaseConfig {
	readonly APP_TITLE = 'typescript-template';

	readonly PORT = 8080;
}

/**
 * Load & export environment variables
 */
export const env: Environment = configure(Environment);
