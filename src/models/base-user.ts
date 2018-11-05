import { Request, Response } from 'express';
import { hashSync } from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Validation
import {
	IsUrl,
	Length,
	IsEmail,
	IsAlphanumeric,
	IsDate,
	IsOptional
} from 'class-validator';

// Bodyguards
import {
	AnyoneCanRead,
	OnlySelfCanRead,
	OnlyAdminCanRead,
	OnlySelfCanWrite,
	OnlyAdminCanWrite,
	BodyguardKey,
	CanSearch
} from '../bodyguard';

// Models
import { BaseModel } from './base-model';
import { UserRole, UserStatus } from '../enums';

@Entity('User')
export class BaseUser extends BaseModel {
	// ID
	@PrimaryGeneratedColumn()
	@BodyguardKey()
	@AnyoneCanRead()
	public id: number = undefined;

	// Time created
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@AnyoneCanRead()
	public timeCreated: Date = undefined;

	// Time last accessed
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@AnyoneCanRead()
	public timeAccessed: Date = undefined;

	// Access token (jwt)
	@Column({ nullable: true })
	public token: string = undefined;

	// Username
	@Column({ unique: true })
	@Length(4, 16)
	@IsAlphanumeric()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public username: string = undefined;

	// First name
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public fname: string = undefined;

	// Last name
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public lname: string = undefined;

	// Email
	@Column({ nullable: true, unique: true })
	@IsEmail()
	@IsOptional()
	@OnlySelfCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public email: string = undefined;

	// Email (temporary)
	@Column({ nullable: true })
	@IsEmail()
	@IsOptional()
	@OnlySelfCanWrite()
	public tempEmail: string = undefined;

	// Password
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@OnlySelfCanWrite()
	public password: string = undefined;

	// Password (temporary)
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@OnlySelfCanWrite()
	public tempPassword: string = undefined;

	// BaseUser Role
	@Column({ default: UserRole.Basic })
	@Length(1, 250)
	@IsOptional()
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	public role: UserRole = undefined;

	// BaseUser Status
	@Column({ default: UserStatus.Pending })
	@Length(1, 250)
	@IsOptional()
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	public status: UserStatus = undefined;

	// Biography
	// TODO: Validate
	@Column({ type: 'text', nullable: true })
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public biography: string = undefined;

	// Geographical Location
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public location: string = undefined;

	// Thumbnail image
	@Column({ nullable: true })
	@IsUrl({ allow_protocol_relative_urls: true })
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public thumbnail: string = undefined;

	// Post hook
	public beforeLoadPost(request: Request, response: Response) {
		// User route
		if (request.baseUrl.includes('/v1/user')) {
			const user = request.body;

			// Check if user has some sort of password
			if (!user.password) {
				response.validationResponder(
					{
						message: 'Must supply a password'
					},
					response
				);
				return false;
			}

			// Hash password
			if ('password' in user && user.password) {
				user.password = hashSync(user.password, 12);
			}
		}

		return true;
	}

	// Put hook
	public beforeLoadPut(request: Request, response: Response) {
		// User route
		if (request.baseUrl.includes('/v1/user')) {
			const user = request.body;

			// Temp password
			if ('password' in user && user.password) {
				// TODO: Deep copy, not letter-by-letter
				for (let i = 0; i < user.password.length; i++) {
					user.tempPassword += user.password[i];
				}

				user.tempPassword = hashSync(user.tempPassword, 12);
			}

			delete user.password;
		}

		return true;
	}
}

export interface BaseUserInterface {
	new (): BaseUser;
}
