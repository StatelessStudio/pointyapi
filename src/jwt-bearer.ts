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

import { Request } from 'express';

const btoa = require('btoa');
const atob = require('atob');

class JwtBearer {
	public key = 'unset_key';

	constructor(key: string = 'unset_key') {
		if ('JWT_KEY' in process.env && process.env.JWT_KEY) {
			this.key = process.env.JWT_KEY;
		}
	}

	public sign(user: BaseUser) {
		return btoa(
			JWT.sign({ id: user.id }, this.key, {
				expiresIn: process.env.JWT_TTL
			})
		);
	}

	public getToken(request: Request) {
		const token = request.header('Authorization');

		if (token && token.includes('Bearer')) {
			return token.replace('Bearer ', '');
		}
		else {
			return false;
		}
	}

	public dryVerify(token: string) {
		try {
			return JWT.verify(atob(token), this.key);
		} catch (ex) {
			return false;
		}
	}
}

export const jwtBearer = new JwtBearer();
