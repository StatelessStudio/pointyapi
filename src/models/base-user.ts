import { Request, Response } from 'express';
import { hashSync } from 'bcryptjs';

// Models
import { BaseModel } from './base-model';

/**
 * Base User
 */
export class BaseUser extends BaseModel {
	public id?: any = undefined;
	public timeCreated?: Date = undefined;
	public timeUpdated?: Date = undefined;
	public username?: string = undefined;
	public email?: string = undefined;
	public password?: string = undefined;
	public role?: any = undefined;
	public status?: any = undefined;

	// Post hook
	public async beforePost(request: Request, response: Response) {
		// Check if user has some sort of password
		if (!this.password) {
			response.validationResponder('Must supply a password');
			return false;
		}

		// Hash password
		if ('password' in this && this.password) {
			this.password = hashSync(this.password, 12);
		}

		return true;
	}

	// Patch hook
	public async beforePatch(request: Request, response: Response) {
		// Temp password
		if ('password' in this && this.password) {
			this.password = hashSync(this.password, 12);
		}

		return true;
	}
}

export type BaseUserInterface = new () => BaseUser;
