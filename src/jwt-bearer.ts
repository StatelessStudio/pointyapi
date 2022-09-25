/**
 * # JWT Tokens
 *
 * JWT Authorization headers are the default way to handle authentication.
 *
 * If you use the loginEndpoint and onlySelf/onlyAdmin guards, this will
 * be taken care of for you.
 */

/**
 * JwtBearer
 */
import { BaseUser } from './models/base-user';
import * as JWT from 'jsonwebtoken';

import { Request } from './index';
import { env } from './environment';

import btoa = require('btoa');
import atob = require('atob');

/**
 * JWT Bearer for authentication
 */
export class JwtBearer {
	// Private Key
	public key: string;

	/**
	 * Construct a JWT Bearer token
	 * @param key Private key
	 */
	constructor(key?: string) {
		this.key = key ?? env.JWT_KEY;
	}

	/**
	 * Get the configured TTL for JWTs
	 * @param isRefresh
	 * @returns Returns the TTL in seconds
	 */
	public getTTLSeconds(isRefresh = false): number {
		const ttlMin = isRefresh ?
			env.JWT_REFRESH_TTL_MIN :
			env.JWT_ACCESS_TTL_MIN;

		return ttlMin * 60;
	}

	/**
	 * Get expiration of the token
	 * @return Returns the expiration epoch time
	 */
	public getExpiration(isRefresh = false): number {
		return (
			Date.now() +
			(this.getTTLSeconds(isRefresh) * 1000)
		);
	}

	/**
	 * Sign the token to the User
	 * @param user User to sign the JWT for
	 * @return Returns the signed, base64-encoded token
	 */
	public sign(
		user: BaseUser,
		isRefresh = false,
		data: Record<string, unknown> = {}
	): string {
		const payload = Object.assign(data, {
			id: user.id,
			isRefresh: isRefresh
		});

		const jwt = JWT.sign(payload, this.key, {
			expiresIn: this.getTTLSeconds(isRefresh)
		});

		return btoa(jwt);
	}

	/**
	 * Get a token from an HTTP Request
	 * @param request Request to fetch the token from
	 * @return Returns the token if successful, otherwise false
	 */
	public getToken(request: Request): boolean | string {
		const token = request.header('Authorization');

		if (token && token.includes('Bearer')) {
			return token.replace('Bearer ', '');
		}
		else {
			return false;
		}
	}

	/**
	 * Verify the token
	 * @param token Token to verify
	 * @return Returns the token payload, or false if invalid
	 */
	public dryVerify(token: string): any {
		try {
			return JWT.verify(atob(token), this.key);
		}
		catch (ex) {
			return false;
		}
	}
}

export const jwtBearer = new JwtBearer();
