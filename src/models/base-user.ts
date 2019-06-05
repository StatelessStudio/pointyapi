import { Request, Response } from 'express';
import { hashSync } from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Validation
import {
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
	OnlySelfCanWrite,
	OnlyAdminCanWrite,
	BodyguardKey,
	CanSearch
} from '../bodyguard';

// Models
import { BaseModel } from './base-model';
import { UserRole, UserStatus } from '../enums';

/**
 * Base User
 */
@Entity('User')
export class BaseUser extends BaseModel {
	// ID
	@PrimaryGeneratedColumn()
	@BodyguardKey()
	@AnyoneCanRead()
	public id: any = undefined;

	// Time created
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@AnyoneCanRead()
	public timeCreated: Date = undefined;

	// Time last updated
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@AnyoneCanRead()
	public timeUpdated: Date = undefined;

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
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public fname: string = undefined;

	// Last name
	@Column({ nullable: true })
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
	@OnlySelfCanWrite()
	public password: string = undefined;

	// Password (temporary)
	@Column({ nullable: true })
	@OnlySelfCanWrite()
	public tempPassword: string = undefined;

	// BaseUser Role
	@Column({ default: UserRole.Basic })
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	public role: UserRole = undefined;

	// BaseUser Status
	@Column({ default: UserStatus.Pending })
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	public status: UserStatus = undefined;

	// Biography
	// TODO: Validate
	@Column({ type: 'text', nullable: true })
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public biography: string = undefined;

	// Geographical Location
	@Column({ nullable: true })
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public location: string = undefined;

	// Thumbnail image
	@Column({ nullable: true })
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public thumbnail: string = undefined;

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
